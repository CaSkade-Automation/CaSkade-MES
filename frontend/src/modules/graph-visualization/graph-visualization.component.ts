import { Component, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as d3Selection from 'd3-selection';
import * as d3Force from 'd3-force';
import * as d3Transition from 'd3-transition';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from'd3-scale-chromatic';
import * as d3Drag from'd3-drag';
import { ActivatedRoute } from '@angular/router';
import { D3GraphData, D3Link, D3Node, D3Serializable, NodeType } from './D3GraphData';
import { ModuleService } from '../../shared/services/module.service';
import { QueryService } from '../../shared/services/query.service';
import { RdfElement } from '../../../../shared/src/models/RdfElement';


@Component({
    selector: 'graph-visualization',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './graph-visualization.component.html',
    styleUrls: ['./graph-visualization.component.scss']
})
export class GraphVisualizationComponent implements AfterViewInit {

    name: string;
    svg: d3Selection.Selection<any, any, any, any>;       // Reference to the svg element of the simulation

    nodesContainer: any;    // Container for all nodes
    nodes: d3Selection.Selection<d3Selection.BaseType, D3Node, any, any>;      // The nodes of the simulation
    texts: any;     // The node texts of the simulation

    linksContainer: any;    // Container for all links
    links: d3Selection.Selection<d3Selection.BaseType, D3Link, any, any>; ;     // The links of the simulation
    linkTexts: any; // The linkTexts of the simulation

    /** Loaded data: Connected modules with their capabilities and skills*/
    data: D3GraphData;

    color: any;     // Contains scale of colors

    typeColors = new Map<string, string>();     // Used to store colors per type
    /**Simulation of the force directed graph */
    simulation: d3Force.Simulation<D3Node, D3Link>;


    // margin = { top: 10, right: 30, bottom: 30, left: 40 };
    margin = 5;
    width = 100;
    height = 100;


    nodeRadius = 16;           // standard radius of a node

    constructor(
        private route: ActivatedRoute,
        private moduleService: ModuleService,
        private queryService: QueryService
    ) {}

    @ViewChild('g') svgContainer: ElementRef;
    svgHeight = 200;
    svgWidth = 200;
    moduleIri: string;

    ngAfterViewInit(): void {
        this.svgWidth = this.svgContainer.nativeElement.offsetWidth;
        this.svgHeight = this.svgContainer.nativeElement.offsetHeight;
        this.route.params.subscribe(p => {
            this.moduleIri = p['moduleName'];
            if(!this.moduleIri) {
                this.moduleService.getAllModules().subscribe(modules => this.setupSimulation(modules));
            } else {
                this.moduleService.getModuleByIri(this.moduleIri).subscribe(module => this.setupSimulation([module]));
            }
        });

    }

    /**Defines settings of the SVG and the color-scheme of the nodes */
    setupSimulation(data: D3Serializable []): void {
        // prepare data
        const graphData = new D3GraphData();
        data.forEach(module => graphData.addData(module.toD3GraphData()));
        this.data = graphData;

        // set svg
        this.svg = d3Selection.select("#graph")
            .attr("width",this.svgWidth + 65)
            .attr("height", this.svgHeight + 65);

        this.color = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10); // chooses a scheme category for node colours

        const markerBoxWidth = 10;
        const markerBoxHeight = 8;
        this.svg.append('defs').append('marker') // marker/ arrow  settings
            .attr("id", 'arrowhead')
            .attr('viewBox', [0, -4, markerBoxWidth, markerBoxHeight]) //coordinate system
            .attr('refX', 2*markerBoxWidth) // arrow position and dimensions
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 1.5*markerBoxWidth)
            .attr('markerHeight', 1.5*markerBoxHeight)
            .attr('xoverflow', 'visible')
            .append('path')
            .attr('d', 'M 0,-4 L 10,0 L 0,4')
            .attr('fill', '#555')
            .style('stroke', 'none');

        // Define elemennt containers. Important nodes after links so that nodes are rendered on top
        this.linksContainer = this.svg.append('g').attr('class', 'linksContainer');
        this.nodesContainer = this.svg.append('g').attr('class', 'nodesContainer');

        // set Simulation

        this.simulation = d3Force.forceSimulation(this.data.nodes)
            .force("link", d3Force.forceLink()
                .id((node: D3Node) => node.id)
                .distance(150)
                .links(this.data.links))
            .force("collision", d3Force.forceCollide(this.nodeRadius*1.5))
            .force("charge", d3Force.forceManyBody().strength(-60)) // node magnetism / attraction
            .force("center", d3Force.forceCenter(this.svgWidth/ 2, this.svgHeight / 2)) //Zentrierung der Nodes
            .on("tick", this.ticked); // tick on every step of the simulation

        this.updateSimulation();
    }



    /**
   * Draws the graph, executed first on AfterContentInit while setSimulation() and on every doubleclick on a node
   */
    updateSimulation(): void {
        this.nodes = this.nodesContainer.selectAll(".nodes")
            .data(this.data.nodes, (d) => this.convertSpecialChars(d.id));

        const nodeGroups = this.nodes.enter().append("g").attr("class", "nodeGroup");
        const nodeEnter= nodeGroups.append("circle")
            .attr("class", "nodes")
            .attr("id", (d) => this.convertSpecialChars(d.id))
            .attr("r", (d) => this.nodeRadius)
            .attr("cx", (d) => { return d.x; })
            .attr("cy", (d) => { return d.y; });

        nodeEnter.on('mouseover', this.mouseover);
        nodeEnter.on('mouseout', this.mouseout);
        nodeEnter.style("fill", this.setNodeStyle);
        nodeEnter.on('dblclick', this.nodeDoubleClick);
        nodeEnter.call(d3Drag.drag()  // reactions when dragging a node
            .on("start", this.dragstarted)
            .on("drag", this.dragged)
            .on("end", this.dragended));
        this.nodes = this.nodes.merge(nodeEnter); // merge old elements with entered elements

        this.nodes.exit().remove(); // remove data-elements of exit-selection(all old elements, wich are not in the new dataset)

        this.links = this.linksContainer.selectAll(".links").data(this.data.links);

        const linkEnter=this.links.enter()
            .append("path")
            .attr("fill", "transparent")
            .style("stroke", "#555")
            .attr("class", "links")
            .attr("d", (l: D3Link) => this.positionLinks(l))
            .attr('marker-end', 'url(#arrowhead)') // arrow on end of the link
        ;

        this.links = this.links.merge(linkEnter); // merge old elements with entered elements
        this.links.exit().remove(); // remove data-elements of exit-selection(all old elements, wich are not in the new dataset)

        this.linkTexts = this.linksContainer.selectAll('.linkTexts')
            .data(this.data.links);

        const linkTextsEnter = this.linkTexts.enter().append('text')
            .attr("class", "linkTexts")
            // .data(this.data.links, function (l: D3Link){return `${l.source.id}_${l.target.id}`;})
            .attr("font-weight", "normal")
            .text((d) => d.type); // get text from data

        this.linkTexts = this.linkTexts.merge(linkTextsEnter);
        this.linkTexts.exit().remove();

        this.texts = this.nodesContainer.selectAll(".nodeTexts").data(this.data.nodes, (d) => this.convertSpecialChars(d.id));

        const textEnter = nodeGroups.append("text")
            .attr("class", "nodeTexts")
            // .data(this.data.nodes, (d) => this.convertSpecialChars(d.id))
            .attr("font-weight", "normal")
            .text((d) => d.name); // get text from data

        this.texts=this.texts.merge(textEnter);
        this.texts.exit().remove();

        this.simulation.nodes(this.data.nodes);
    }

    /**
     * Function executed on every tick in the simulation. Defines restrictions for positions of node, text, link-text and link. The functions computes the position of each element
     * @param d The position of every graph element (i.e. node, link...)
     */
    ticked = (): void => {
        this.nodes
            .attr("cx", (d: D3Node) => {
                if (d.x < 0) return 30;
                if (d.x > this.svgWidth) return this.svgWidth - 30;
                else return d.x;
            })
            .attr("cy", (d: D3Node) => {
                if (d.y < 0) return 30;
                if (d.y > this.svgHeight) return this.svgHeight - 30;
                else return d.y;
            });

        this.links
            .attr("d", (l: D3Link) => this.positionLinks(l));

        this.texts
            .attr("dx", (d: D3Node) => d.x + 15)
            .attr("dy", (d: D3Node) => d.y + 15);

        this.linkTexts
            .attr("dx", (l: D3Link) => {  // restrictions for link text positions in the svg
                const midX = (l.target.x + l.source.x) / 2 - 10;
                return  midX;
            })
            .attr("dy", (l: D3Link) => {
                const midY = (l.target.y + l.source.y) / 2;
                return  midY;
            });

    }

    private positionLinks(l: D3Link) {
        const offset = 30;

        const midpointX = (l.source.x + l.target.x) / 2;
        const midpointY = (l.source.y + l.target.y) / 2;

        const dx = (l.target.x - l.source.x);
        const dy = (l.target.y - l.source.y);

        const normalise = Math.sqrt((dx * dx) + (dy * dy));
        const offSetX = midpointX + offset*(dy/normalise);
        const offSetY = midpointY - offset*(dx/normalise);

        return "M" + l.source.x + "," + l.source.y +
                "S" + offSetX + "," + offSetY +
                " " + l.target.x + "," + l.target.y;
    }

    private convertSpecialChars(iri: string): string {
        return iri.replace(/([://#.])+/g,"_");
    }

    /**
     * Function executed on a drag start
     */
    dragstarted = (event: d3Drag.D3DragEvent<any, d3Force.SimulationNodeDatum ,any>, d: d3Force.SimulationNodeDatum): void => {
        if (!d3Transition.active(d as d3Selection.BaseType)) this.simulation.alphaTarget(0.3).restart();
        d.fx = event.x;
        d.fy = event.y;
    }

    /**
   * Drag function, executed on every drag movement
   * @param d The dragged node
   */
    dragged = (event: d3Drag.D3DragEvent<any, d3Force.SimulationNodeDatum ,any>, d: d3Force.SimulationNodeDatum): void => {
        d.fx = event.x;
        d.fy = event.y;
        this.increaseNodeRadius(d as D3Node);   // Also increase here to prevent decrease when cursor moves away from node
    }

    dragended = (event: d3Drag.D3DragEvent<any, d3Force.SimulationNodeDatum ,any>, d: d3Force.SimulationNodeDatum): void => {
        if (!d3Transition.active(d as d3Selection.BaseType)) this.simulation.alphaTarget(.03);
        // d.fx = null;
        // d.fy = null;
        this.decreaseNodeRadius(d as D3Node);   // Also decrease here in case cursor moved away from node
    }

    /**
     * Mouseover function, executed when mouse over node. The radius of the node will increase.
     * @param d node under the cursor
     */
    mouseover = (event: MouseEvent, d: D3Node): void => {
        this.increaseNodeRadius(d);
    }

    private increaseNodeRadius(d: D3Node): void {
        const elementId = `#${this.convertSpecialChars(d.id)}`;
        this.nodesContainer.select(elementId).transition()
            .duration(100)
            .attr('r', this.nodeRadius * 1.5);
    }

    /**
     * Mousout function, executed when mouse cursor leaves the node. Decreases radius to origin.
     * @param d node wich is left by the cursor after mouseover
     */
    mouseout = (event: MouseEvent, d: D3Node): void => {
        this.decreaseNodeRadius(d);
    }

    private decreaseNodeRadius(d: D3Node): void {
        const elementId = `#${this.convertSpecialChars(d.id)}`;
        this.nodesContainer.select(elementId).transition()
            .duration(100)
            .attr('r', this.nodeRadius);
    }


    /**
     * Doubleclick function, executed on every doubleclick on a node
     *@param d The clicked node
    */
    nodeDoubleClick = (e: MouseEvent, d: D3Node): void => {
        this.queryService.getNeighbors(d.id).subscribe(neighborData => {
            const numberOfNeighbors = neighborData.length;
            const distance = 15;

            // Create nodes and links for data and position symmetrically
            neighborData.forEach(nD => {
                let i = 0;
                const angle = (360/numberOfNeighbors * i) * (Math.PI/180);
                const source = new RdfElement(nD.source);
                const relation = new RdfElement(nD.relation);
                const target = new RdfElement(nD.target);

                let sourceNode = this.data.getNodeById(source.iri);
                if (!sourceNode) {
                    const x = d.x + Math.cos(angle) * distance;
                    const y = d.y + Math.sin(angle) * distance;
                    sourceNode = new D3Node(source.iri, source.getLocalName(), NodeType.None, x, y);
                    this.data.addNodes([sourceNode]);
                }

                let targetNode = this.data.getNodeById(target.iri);
                if (!targetNode) {
                    const x = d.x = Math.cos(angle) * distance;
                    const y = d.y = Math.sin(angle) * distance;
                    targetNode = new D3Node(target.iri, target.getLocalName(), NodeType.None, x, y);
                    this.data.addNodes([targetNode]);
                }

                const link = new D3Link(sourceNode, targetNode, relation.getLocalName());
                this.data.addLinks([link]);
                i++;
            });

            this.updateSimulation();
        });
    }

    /** Returns the color of the inner circle of a node */
    setNodeStyle = (d: D3Node) => {
        const typeColor = this.typeColors.get(d.type);
        if(!typeColor) {
            const newTypeColor = this.color(Math.random() * 10);
            this.typeColors.set(d.type, newTypeColor);
        }

        return this.typeColors.get(d.type);
    }

}
