import { Component, AfterContentInit, ViewEncapsulation, HostListener, ViewChild, ElementRef } from '@angular/core';
import * as d3 from "d3"
import { enterView } from '@angular/core/src/render3/state';
import { pathToFileURL } from 'url';
import { window } from 'rxjs/operators';
import { ModuleService } from 'app/shared/services/module.service';


@Component({
  selector: 'graph-visualization',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './graph-visualization.component.html',
  styleUrls: ['./graph-visualization.component.scss']
})
export class GraphVisualizationComponent implements AfterContentInit {

  constructor(
    private moduleService: ModuleService
  ) { 
  };

  @ViewChild('g') svgContainer: ElementRef;

  ngAfterContentInit(): void {
    const margin = { top: 10, right: 30, bottom: 30, left: 40 }; 
    const width = 100;                //parent.innerWidth - margin.left - margin.right;
    //var width= window.innerWidth;
    const height = 100;
    const rad = 20                    // node radius
    const nodeborder = 8;             // node border thickness 
    const testweite = parent.innerWidth;
    const svg = d3.select("#graph")   // size definitions for the svg
      .append("svg")
      .attr("width", width + '%')
      .attr("height", height+'%')
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



    const colors = d3.scaleOrdinal(d3.schemeCategory10); // chooses a scheme category for node colours

    svg.append('defs').append('marker')
      .attr("id", 'arrowhead')
      .attr('viewBox', '-0 -5 10 10') //coordinate system
      .attr('refX', rad + nodeborder) // arrow position and dimensions
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 13)
      .attr('markerHeight', 13)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');




/* Get data*/
//##########################################################
var receivedData= this.moduleService.getAllModulesWithCapabilitiesAndSkills();
var data= {nodes:[], links:[]};
let idMap= new Map();                 // Map for saving Node-IDs
var id=0;                             // ID start value
receivedData.forEach(receivedModule => {  //loop over all modules
id++;
idMap.set(receivedModule, id);        // assigns an ID for each module-node
data.nodes.push({                     // adds a node for each module
"id" : idMap.get(receivedModule),
"name": receivedModule.name,
"group": 1                            // assings node-groups (here: node colour)
});
  
  receivedModule.capabilities.forEach(capability=>{ //loop over all capabilities of current module 
  id++;
  idMap.set(capability, id);          // assigns an ID for each capability-node
  data.nodes.push({                   // adds a node for each capability of current module
  "id" : idMap.get(capability),
  "name": capability.name,
  "group": 2
  })
  data.links.push({                   // adds a link between capability and module
  "source": idMap.get(receivedModule),    // defines source and target of the link. Important for the direction of the link/arrow
  "target": idMap.get(capability),
  "type": "has_capability"            // adds a link description
  })
    
    capability.hasInput.forEach(input=>{
    id++;
    idMap.set(input, id);             // assigns an ID for each input-node
    data.nodes.push({                 // adds a node for each input of current capability
    "id": idMap.get(input),
    "name": input.name,
    "group": 3
    })
    data.links.push({                 // adds a link between capability and input
    "source": idMap.get(capability),
    "target": idMap.get(input),
    "type": "has_input"
    }) 
    id++;
    data.nodes.push({                 // adds a node for rdf:type of current input
    "id": id,                         // adds an ID for the type node (not saved in idMap)
    "name": input.stateType,
    "group": 6
    })
    data.links.push({                 // adds a link between rdf:type and input
    "source": idMap.get(input),
    "target": id,                     //assigns an ID for each type-node (not saved in idMap)
    "type": "rdf:type"
    })
    })
       
    capability.hasOutput.forEach(output=>{
    id++;
    idMap.set(output,id);             // assigns an ID for each output-node
    data.nodes.push({                 // adds a node for each output of current capability
    "id" : idMap.get(output),
    "name": output.name,
    "group": 4
    })
    data.links.push({                 // adds a link between capability and output
    "source": idMap.get(capability),
    "target": idMap.get(output),
    "type": "has_output"
    })  
    id++;   
    data.nodes.push({                 // adds a node for rdf:type of current output
    "id": id,
    "name": output.stateType,
    "group": 6
    })
    data.links.push({                 // adds a link between rdf:type and input
    "source": idMap.get(output),
    "target": id,
    "type": "rdf:type"
    })
    })
       
    capability.executableViaSkill.forEach(skill=>{
    id++;
    idMap.set(skill, id)              // adds a node for each skill of current capability
    data.nodes.push({
    "id" : idMap.get(skill),
    "name": skill.name,
    "group": 5
    })
    data.links.push({                // adds a link between  current capability and current skill node
    "source": idMap.get(capability),
    "target": idMap.get(skill),
    "type": "executable_via_Skill"
    })  
    })

  })
    
});
// ##################################################

    console.log(data);

    const link = svg                // link definitions
      .selectAll(".links")
      .data(data.links)
      .enter()
      .append("line")
      .style("stroke", "#aaa")
      .attr("class", "links")
      .attr('marker-end', 'url(#arrowhead)') // arrow on end of the link
      ;
    link.append("title")
      .text(function (d) { return d.type }); // get link title from data
    const node = svg               // node definitions 
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", rad)
      .on('mouseover', function(){ // function on mousover: increase radius
        d3.select(this).transition()
        .duration('2')
        .attr('r', rad+6)
      })
      .on('mouseout', function(){ // function on mousout: decrease radius to orgin
        d3.select(this).transition()
        .attr('r', rad)
      })
      .on('dblclick', doubleclick)// function on doubleclick:
      
      .style("fill", "white")
      .style("stroke-width", nodeborder)
      .style("stroke", function (d) { return colors(d.group); }) // set different node colours for each node-group
      /*.append ("text") 
        .attr ("dx", 12)
        .attr ("dy", ".35em")
        .text(function(d){return d.name})*/
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged));
    ;

    const text = svg            // node text definitions    
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")

      .text(function (d) { return d.name }); // get text from data

    const linkText = svg        // link text definitions
      .selectAll("links")
      .data(data.links)
      .enter()
      .append("text")
      .style("fill", "#999")
      .text(function (d) { return d.type }); // get link text from data



    


    const ticked = () => {
      const centerWidth=  this.svgContainer.nativeElement.offsetWidth/2; // center definitions of the svg
      const centerHeight= this.svgContainer.nativeElement.offsetHeight/2;

      text
        .attr("dx", (d)=>{    // restrictions for node text positions in the svg
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetWidth;
          const relativeDragX=100* d.x / this.svgContainer.nativeElement.offsetWidth;
          return Math.max(0 + relativeRad, Math.min(relativeDragX + 1.5, width - 5*relativeRad))+'%'})
        .attr("dy",  (d) => {
          const relativeDragY=100* d.y / this.svgContainer.nativeElement.offsetHeight;
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetHeight;
          return Math.max(0 + relativeRad, Math.min(relativeDragY, height - 5*relativeRad))+'%' })

      linkText
        .attr("dx", (d)=>{  // restrictions for link text positions in the svg
          d.source.x= Math.max(0 + rad, Math.min(d.source.x, this.svgContainer.nativeElement.offsetWidth - 5*rad));
          d.target.x=Math.max(0 + rad, Math.min(d.target.x, this.svgContainer.nativeElement.offsetWidth - 5*rad))
          const relativeTargetX = 100*d.target.x/this.svgContainer.nativeElement.offsetWidth;
          const relativeSourceX = 100*d.source.x/this.svgContainer.nativeElement.offsetWidth;
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetWidth;
          return Math.min(width- 5*relativeRad, (Math.max(0+ relativeRad, ((relativeSourceX-relativeTargetX)/2)+ relativeTargetX))) +'%';
        })
        .attr("dy", (d)=>{
          d.source.y=Math.max(0 + rad, Math.min(d.source.y, this.svgContainer.nativeElement.offsetHeight - 5*rad));
          d.target.y=Math.max(0 + rad , Math.min(d.target.y, this.svgContainer.nativeElement.offsetHeight - 5*rad));
          const relativeTargetY = 100*d.target.y/this.svgContainer.nativeElement.offsetHeight;
          const relativeSourceY = 100*d.source.y/this.svgContainer.nativeElement.offsetHeight;
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetHeight;
          return Math.min(height- 5*relativeRad, (Math.max(0+ relativeRad, ((relativeSourceY-relativeTargetY)/2)+ relativeTargetY))) +'%';
        })

      link  
        .attr("x1",  (d)=> {  // restrictions for link positions in the svg
          d.source.x= Math.max(0 + rad, Math.min(d.source.x, this.svgContainer.nativeElement.offsetWidth - 5*rad));
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetWidth; // converting radius from absolute to relative
          const relativeSourceX = 100*d.source.x/this.svgContainer.nativeElement.offsetWidth;
          return relativeSourceX+'%';})
          .attr("y1",  (d)=> {
            d.source.y=Math.max(0 + rad, Math.min(d.source.y, this.svgContainer.nativeElement.offsetHeight - 5*rad));
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetWidth;
          const relativeSourceY = 100*d.source.y/this.svgContainer.nativeElement.offsetHeight;
          return relativeSourceY+'%';})
        .attr("x2",  (d)=> {
          d.target.x=Math.max(0 + rad, Math.min(d.target.x, this.svgContainer.nativeElement.offsetWidth - 5*rad))
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetWidth;
          const relativeTargetX = 100*d.target.x/this.svgContainer.nativeElement.offsetWidth;
         return relativeTargetX+'%';})
        .attr("y2",  (d)=> {
          d.target.y=Math.max(0 + rad , Math.min(d.target.y, this.svgContainer.nativeElement.offsetHeight - 5*rad));
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetWidth;
          const relativeTargetY = 100*d.target.y/this.svgContainer.nativeElement.offsetHeight;
          return relativeTargetY+'%';})

      node 
        .attr("cx", (d) => { // restrictions for node positions in the svg
          d.x=Math.max(0 + rad, Math.min(d.x, this.svgContainer.nativeElement.offsetWidth - 5*rad))
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetWidth;
          const relativeDragX=100* d.x / this.svgContainer.nativeElement.offsetWidth;
          return relativeDragX+'%';
        }) 
        .attr("cy", (d) => {
          d.y= Math.max(0 + rad, Math.min(d.y, this.svgContainer.nativeElement.offsetHeight - 5*rad))
          const relativeRad = 100* rad / this.svgContainer.nativeElement.offsetWidth;
          const relativeDragY=100* d.y / this.svgContainer.nativeElement.offsetHeight;
          return relativeDragY+'%';})
    }

    const simulation = d3.forceSimulation(data.nodes) // simulation
      .force("link", d3.forceLink()
        .id(function (d) { return d.id; })
        .distance(300)
        .links(data.links)
      )
      .force("charge", d3.forceManyBody().strength(-400)) // node magnetism /attraction
      .force("center", d3.forceCenter(this.svgContainer.nativeElement.offsetWidth/2, this.svgContainer.nativeElement.offsetHeight/2)) //Zentrierung der Nodes
        

         
     
      .on("tick", ticked); // tick on every step of the simulation

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function doubleclick(){
      id++;
      data.nodes.push({
        "id": id,
        "name": "neighbor",
        "group": 7
      })
    }

    function dragged(d) {

     // console.log(d3.event)
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragended(d) {
      //if (!d3.event.active) simulation.alphaTarget(0);
      //d.fx = null;
      //d.fy = null;
    }

  }
  
 
    
  

}
