import { Component, OnInit, AfterContentInit, ViewEncapsulation, HostListener, ViewChild, ElementRef } from '@angular/core';
import * as d3 from "d3";
import { ActivatedRoute } from '@angular/router';
import { NodeCreatorService } from './node-creator.service';


@Component({
    selector: 'graph-visualization',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './graph-visualization.component.html',
    styleUrls: ['./graph-visualization.component.scss']
})
export class GraphVisualizationComponent implements AfterContentInit, OnInit {
    name: string;
    svg: any;
    link: any;
    /** The displayed node name*/
    text: any;
    /** The displayed link description */
    linkText: any;
    /** The displayed node */
    node: any;
    /** Loaded data: Connected modules with their capabilities and skills*/
    data: any;
    /**Returns different colors automatically. The node-border color is the same for all node-group members*/
    color: any;
    /**Simulation of the force directed graph */
    simulation: any;


    margin = { top: 10, right: 30, bottom: 30, left: 40 };
    width = 100;
    height = 100;
    /**Defines the nodeborder thickness*/
    nodeborder = 8;
    /**Defines the standard radius of a node*/
    rad = 20;

    index=0;

    constructor(
        private route: ActivatedRoute,
        private nodeCreatorService: NodeCreatorService
    ) {}

    @ViewChild('g') svgContainer: ElementRef;
    moduleName: string;
    ngOnInit(): void {}


    ngAfterContentInit(): void {



        this.route.params.subscribe(p => {
            this.moduleName = p['moduleName'];
        });
        // this.data = this.nodeCreatorService.getAllNodes(this.moduleName); // load data created by node-creator.service
        this.data = this.nodeCreatorService.getAllNodes();

        this.setSvg();
        this.setSimulation();
    }

    /**Defines settings of the simulation */
    setSimulation(){
        this.simulation = d3.forceSimulation(this.data.nodes);
        this.simulation
            .force("link", d3.forceLink()
                .id(function (d) { return d.id; })
                .distance(80)
                .links(this.data.links))
            .force("collision", d3.forceCollide(40))
            .on("tick", this.ticked) // tick on every step of the simulation
            .force("charge", d3.forceManyBody().strength(-400)) // node magnetism / attraction
            .force("center", d3.forceCenter(this.svgContainer.nativeElement.offsetWidth / 2, this.svgContainer.nativeElement.offsetHeight / 2)); //Zentrierung der Nodes

        this.refreshSimulation();
    }



    /**Defines settings of the SVG and the color-scheme of the nodes */
    setSvg(){

        this.svg = d3.select("#graph")   // size definitions for the svg
            .append("svg")
            .attr("width", this.width + '%')
            .attr("height", this.height + '%')
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");



        this.color = d3.scaleOrdinal(d3.schemeCategory10); // chooses a scheme category for node colours

        this.svg.append('defs').append('marker') // marker/ arrow  settings
            .attr("id", 'arrowhead')
            .attr('viewBox', '-0 -5 10 10') //coordinate system
            .attr('refX', this.rad + this.nodeborder) // arrow position and dimensions
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 13)
            .attr('markerHeight', 13)
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#999')
            .style('stroke', 'none');}



    /**
   * Draws the graph, executed first on AfterContentInit while setSimulation() and on every doubleclick on a node
   */
    refreshSimulation() {
        this.link = this.svg.selectAll(".link").data(this.data.links, function (d){return d.target.id;});
        const linkEnter=this.link.enter()     //enter-selection
            .append("line").style("stroke", "#aaa")
            .attr("class", "links")
            .attr('marker-end', 'url(#arrowhead)') // arrow on end of the link
      ;
        linkEnter.append("title")
            .text(function (d){return d.type;});
        this.link = this.link.merge(linkEnter); // merge old elements with entered elements
        this.link.exit().remove(); // remove data-elements of exit-selection(all old elements, wich are not in the new dataset)

        this.node = this.svg.selectAll(".node").data(this.data.nodes, function (d){return d.id;});

        const nodeEnter= this.node.enter().append("circle")
            .attr("r", (d) => {
                if (d.group == 1) { return this.rad + 8; }
                else { return this.rad; }
            });
        nodeEnter.on('mouseover', this.mouseover);
        nodeEnter.on('mouseout', this.mouseout);
        nodeEnter.style("fill", this.setNodeStyle)
            .style("stroke-width", this.nodeborder)
            .style("stroke", (d) => { return this.color(d.group); }); // set different node colours for each node-group
        nodeEnter.on('dblclick', this.nodeDoubleClick);
        nodeEnter.call(d3.drag()  // reactions when dragging a node
            .on("start", this.dragstarted)
            .on("drag", this.dragged)
            .on("end", this.dragended));
        this.node=this.node.merge(nodeEnter); // merge old elements with entered elements
        this.node.exit().remove(); // remove data-elements of exit-selection(all old elements, wich are not in the new dataset)


        this.text = this.svg.selectAll("text").data(this.data.nodes);
        const textEnter=this.text.enter().append("text")
            .data(this.data.nodes, function (d){return d.name;})

            .attr("font-weight", function (d) {
                if (d.group == 1) { return "bold"; }
                else { return "normal"; }
            })
            .text(function (d) { console.log(d.name);
                return d.name; }); // get text from data
        this.text=this.text.merge(textEnter);
        this.text.exit().remove();

        this.linkText = this.svg.selectAll("links").data(this.data.links, function (d){ return d.type;});
        const linkTextEnter=this.linkText.enter().append("text")
            .style("fill", "#999")
            .attr("font-style", "italic")
            .text(function (d) { return d.type; }); // get link text from data
        this.linkText=this.linkText.merge(linkTextEnter);
        this.linkText.exit().remove();


        this.simulation.nodes(this.data.nodes); // simualtion uses current data
        this.simulation.force("link").links(this.data.links);

    }
  /**
 * Function executed on every tick in the simulation. Defines restrictions for positions of node, text, link-text and link. The functions computes the position of each element
 * @param d The position of every graph element (i.e. node, link...)
 */
  ticked = () => {
      const centerWidth = this.svgContainer.nativeElement.offsetWidth / 2; // center definitions of the svg
      const centerHeight = this.svgContainer.nativeElement.offsetHeight / 2;

      this.text
          .attr("dx", (d) => {    // restrictions for node text positions in the svg
              const relativeRad = 100 * this.rad / this.svgContainer.nativeElement.offsetWidth;
              const relativeDragX = 100 * d.x / this.svgContainer.nativeElement.offsetWidth;
              return Math.max(0 + relativeRad, Math.min(relativeDragX + 1.5, this.width - 5 * relativeRad)) + '%';
          })
          .attr("dy", (d) => {
              const relativeDragY = 100 * d.y / this.svgContainer.nativeElement.offsetHeight;
              const relativeRad = 100 * this.rad / this.svgContainer.nativeElement.offsetHeight;
              return Math.max(0 + relativeRad, Math.min(relativeDragY, this.height - 5 * relativeRad)) + '%';
          });

      this.linkText
          .attr("dx", (d) => {  // restrictions for link text positions in the svg
              d.source.x = Math.max(0 + this.rad, Math.min(d.source.x, this.svgContainer.nativeElement.offsetWidth - 5 * this.rad));
              d.target.x = Math.max(0 + this.rad, Math.min(d.target.x, this.svgContainer.nativeElement.offsetWidth - 5 * this.rad));
              const relativeTargetX = 100 * d.target.x / this.svgContainer.nativeElement.offsetWidth;
              const relativeSourceX = 100 * d.source.x / this.svgContainer.nativeElement.offsetWidth;
              const relativeRad = 100 * this.rad / this.svgContainer.nativeElement.offsetWidth;
              return Math.min(this.width - 5 * relativeRad, (Math.max(0 + relativeRad, ((relativeSourceX - relativeTargetX) / 2) + relativeTargetX))) + '%';
          })
          .attr("dy", (d) => {
              d.source.y = Math.max(0 + this.rad, Math.min(d.source.y, this.svgContainer.nativeElement.offsetHeight - 5 * this.rad));
              d.target.y = Math.max(0 + this.rad, Math.min(d.target.y, this.svgContainer.nativeElement.offsetHeight - 5 * this.rad));
              const relativeTargetY = 100 * d.target.y / this.svgContainer.nativeElement.offsetHeight;
              const relativeSourceY = 100 * d.source.y / this.svgContainer.nativeElement.offsetHeight;
              const relativeRad = 100 * this.rad / this.svgContainer.nativeElement.offsetHeight;
              return Math.min(this.height - 5 * relativeRad, (Math.max(0 + relativeRad, ((relativeSourceY - relativeTargetY) / 2) + relativeTargetY))) + '%';
          });

      this.link
          .attr("x1", (d) => {  // restrictions for link positions in the svg
              d.source.x = Math.max(0 + this.rad, Math.min(d.source.x, this.svgContainer.nativeElement.offsetWidth - 5 * this.rad));
              const relativeRad = 100 * this.rad / this.svgContainer.nativeElement.offsetWidth; // converting this.radius from absolute to relative
              const relativeSourceX = 100 * d.source.x / this.svgContainer.nativeElement.offsetWidth;
              return relativeSourceX + '%';
          })
          .attr("y1", (d) => {
              d.source.y = Math.max(0 + this.rad, Math.min(d.source.y, this.svgContainer.nativeElement.offsetHeight - 5 * this.rad));
              const relativeRad = 100 * this.rad / this.svgContainer.nativeElement.offsetWidth;
              const relativeSourceY = 100 * d.source.y / this.svgContainer.nativeElement.offsetHeight;
              return relativeSourceY + '%';
          })
          .attr("x2", (d) => {
              d.target.x = Math.max(0 + this.rad, Math.min(d.target.x, this.svgContainer.nativeElement.offsetWidth - 5 * this.rad));
              const relativeRad = 100 * this.rad / this.svgContainer.nativeElement.offsetWidth;
              const relativeTargetX = 100 * d.target.x / this.svgContainer.nativeElement.offsetWidth;
              return relativeTargetX + '%';
          })
          .attr("y2", (d) => {
              d.target.y = Math.max(0 + this.rad, Math.min(d.target.y, this.svgContainer.nativeElement.offsetHeight - 5 * this.rad));
              const relativeRad = 100 * this.rad / this.svgContainer.nativeElement.offsetWidth;
              const relativeTargetY = 100 * d.target.y / this.svgContainer.nativeElement.offsetHeight;
              return relativeTargetY + '%';
          });

      this.node
          .attr("cx", (d) => {
              d.x = Math.max(0 + this.rad, Math.min(d.x, this.svgContainer.nativeElement.offsetWidth - 5 * this.rad));
              const relativeRad = 100 * this.rad / this.svgContainer.nativeElement.offsetWidth;
              const relativeDragX = 100 * d.x / this.svgContainer.nativeElement.offsetWidth;
              return relativeDragX + '%';
          })
          .attr("cy", (d) => {
              d.y = Math.max(0 + this.rad, Math.min(d.y, this.svgContainer.nativeElement.offsetHeight - 5 * this.rad));
              const relativeRad = 100 * this.rad / this.svgContainer.nativeElement.offsetWidth;
              const relativeDragY = 100 * d.y / this.svgContainer.nativeElement.offsetHeight;
              return relativeDragY + '%';
          });
  }

  /**
 * Function executed on a drag start
 */
  dragstarted = (d) => {
      if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
  }

  /**
   * Drag function, executed on every drag movement
   * @param d The dragged node
   */
  dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
  }

  dragended(d) {

  }
  /**
 * Mouseover function, executed when mouse over node. The radius of the node will increase.
 * @param d node under the cursor
 */
  mouseover(d) {
      if (d.group == 1) { // module-nodes belong to group 1 and are displayed by a bigger node
          d3.select(this).transition()
              .duration('2')
              .attr('r', 20 + 12);
      }
      else {
          d3.select(this).transition()
              .duration('2')
              .attr('r', 20 + 6);
      }
  }
  /**
 * Mousout function, executed when mouse cursor leaves the node. Decreases radius to origin.
 * @param d node wich is left by the cursor after mouseover
 */
  mouseout(d) {
      if (d.group == 1) { // module-nodes belong to group 1 and are displayed by a bigger node
          d3.select(this).transition()
              .attr('r', 20 + 8);
      }
      else {
          d3.select(this).transition()
              .attr('r', 20);
      }
  }
  /**
 * Doubleclick function, executed on every doubleclick on a node
 *@param d The clicked node
 */
  nodeDoubleClick=(d)=> {
      this.index++;
      const testNode = {  "name": "neighbor"+ this.index, "group": 8 };
      this.data.nodes.push(testNode);
      this.data.links.push({ "source": d.id, "target": testNode, "type": "testclick" });
      this.refreshSimulation();
  }

  /** Returns the color of the inner circle of a node */
  setNodeStyle(d){
      if (d.group == 1) { return "black"; }
      else { return "whitesmoke"; }
  }
  /** Returns the node border color for each node-group */
  setNodeBorderStyle=(d)=>{
      return this.color(d.group);
  }

}
