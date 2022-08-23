import { Component, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as d3Selection from 'd3-selection';
import * as d3Force from 'd3-force';
import * as d3Transition from 'd3-transition';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from'd3-scale-chromatic';
import * as d3Drag from'd3-drag';
import { ActivatedRoute } from '@angular/router';
import { NodeCreatorService } from './node-creator.service';
import { D3Link, D3Node, NodeType } from './D3GraphData';
import {v4}  from "uuid";


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
    data: {
        links: D3Link[];
        nodes: D3Node[];
    };

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
        private nodeCreatorService: NodeCreatorService
    ) {}

    @ViewChild('g') svgContainer: ElementRef;
    svgHeight = 100;
    svgWidth = 200;
    moduleName: string;

    ngAfterViewInit(): void {
        this.svgWidth = this.svgContainer.nativeElement.offsetWidth;
        this.svgHeight = this.svgContainer.nativeElement.offsetHeight;
        console.log(this.svgWidth);
        console.log(this.svgHeight);
        this.route.params.subscribe(p => {
            this.moduleName = p['moduleName'];
        });
        // this.data = this.nodeCreatorService.getAllNodes(this.moduleName); // load data created by node-creator.service
        this.nodeCreatorService.getAllNodes().subscribe(data => {
            this.data = data;
            this.setSvg();
            this.setSimulation();
        });
    }

    /**Defines settings of the SVG and the color-scheme of the nodes */
    setSvg(): void {
        this.svg = d3Selection.select("#graph")
            .attr("width",this.svgWidth + 65)
            .attr("height", this.svgHeight + 65);
        // this.svg = d3Selection.select("#graph")   // size definitions for the svg

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
    }

    /**Defines settings of the simulation */
    setSimulation(): void {
        this.simulation = d3Force.forceSimulation(this.data.nodes)
            .force("link", d3Force.forceLink()
                .id((node: D3Node) => node.id)
                .distance(150)
                .links(this.data.links))
            .force("collision", d3Force.forceCollide(this.nodeRadius*1.5))
            .force("charge", d3Force.forceManyBody().strength(-300)) // node magnetism / attraction
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

        const nodeEnter= this.nodes.enter().append("circle")
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
            .append("line")
            .style("stroke", "#555")
            .attr("class", "links")
            .attr("x2", (d) => { return d.source.x; })
            .attr("y2", (d) => { return d.source.y; })
            .attr("x1", (d) => { return d.target.x; })
            .attr("x1", (d) => { return d.target.y; })
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

        this.texts = this.nodesContainer.selectAll(".nodeTexts").data(this.data.nodes);
        const textEnter=this.texts.enter().append("text")
            .attr("class", "nodeTexts")
            .data(this.data.nodes, function (d){return d.id;})
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
                d.x = Math.max(0 + this.nodeRadius, Math.min(d.x, this.svgWidth - 5 * this.nodeRadius));
                const relativeDragX = 100 * d.x / this.svgWidth;
                return relativeDragX + '%';
            })
            .attr("cy", (d: D3Node) => {
                d.y = Math.max(0 + this.nodeRadius, Math.min(d.y, this.svgHeight - 5 * this.nodeRadius));
                const relativeDragY = 100 * d.y / this.svgHeight;
                return relativeDragY + '%';
            });

        this.links
            .attr("x1", (l: D3Link) => {  // restrictions for link positions in the svg
                l.source.x = Math.max(0 + this.nodeRadius, Math.min(l.source.x, this.svgWidth - 5 * this.nodeRadius));
                const relativeSourceX = 100 * l.source.x / this.svgWidth;
                return relativeSourceX + '%';
            })
            .attr("y1", (l: D3Link) => {
                l.source.y = Math.max(0 + this.nodeRadius, Math.min(l.source.y, this.svgHeight - 5 * this.nodeRadius));
                const relativeSourceY = 100 * l.source.y / this.svgHeight;
                return relativeSourceY + '%';
            })
            .attr("x2", (l: D3Link) => {
                l.target.x = Math.max(0 + this.nodeRadius, Math.min(l.target.x, this.svgWidth - 5 * this.nodeRadius));
                const relativeTargetX = 100 * l.target.x / this.svgWidth;
                return relativeTargetX + '%';
            })
            .attr("y2", (l: D3Link) => {
                l.target.y = Math.max(0 + this.nodeRadius, Math.min(l.target.y, this.svgHeight - 5 * this.nodeRadius));
                const relativeTargetY = 100 * l.target.y / this.svgHeight;
                return relativeTargetY + '%';
            });

        this.texts
            .attr("dx", (d: D3Node) => {    // restrictions for node text positions in the svg
                const relativeRadius = 100 * this.nodeRadius / this.svgWidth;
                const relativeDragX = 100 * d.x / this.svgWidth;
                return (relativeDragX + relativeRadius) + '%';
            })
            .attr("dy", (d: D3Node) => {
                const relativeRadius = 100 * this.nodeRadius / this.svgHeight;
                const relativeDragY = 100 * d.y / this.svgHeight;
                return (relativeDragY - 0.5*relativeRadius) + '%';
            });

        this.linkTexts
            .attr("dx", (l: D3Link) => {  // restrictions for link text positions in the svg
                const midX = (l.target.x + l.source.x) / 2 - 10;
                const relativeMidX = 100 * midX / this.svgWidth;
                return  relativeMidX + "%";
            })
            .attr("dy", (l: D3Link) => {
                const midY = (l.target.y + l.source.y) / 2;
                const relativeMidY = 100 * midY / this.svgHeight;
                return  relativeMidY + "%";
            });

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
    dragged(event: d3Drag.D3DragEvent<any, d3Force.SimulationNodeDatum ,any>, d: d3Force.SimulationNodeDatum): void {
        d.fx = event.x;
        d.fy = event.y;
    }

    dragended= (event: d3Drag.D3DragEvent<any, d3Force.SimulationNodeDatum ,any>, d: d3Force.SimulationNodeDatum): void => {
        if (!d3Transition.active(d as d3Selection.BaseType)) this.simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
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
            .duration(200)
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
            .duration(200)
            .attr('r', this.nodeRadius);
    }


    /**
     * Doubleclick function, executed on every doubleclick on a node
     *@param d The clicked node
    */
    nodeDoubleClick = (e: MouseEvent, d: D3Node)=> {
        const nodeId: string = "a" + v4();
        const testNode = new D3Node(nodeId , nodeId.substring(0,4), NodeType.Skill);
        const testLink = new D3Link(d, testNode, "test");
        this.data.links.push(testLink);
        this.data.nodes.push(testNode);
        this.updateSimulation();
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
