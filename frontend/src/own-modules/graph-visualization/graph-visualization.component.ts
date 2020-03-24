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
    //console.log('element ref width:');
   // console.log(this.svgContainer.nativeElement.offsetWidth);

    const margin = { top: 10, right: 30, bottom: 30, left: 40 }; // Definition der Größen
    const width = 100; //parent.innerWidth - margin.left - margin.right;
    //var width= window.innerWidth;
    const height = 100;
    const rad = 20 // Radius eines Knotens
    const nodeborder = 8; // Umrandungsdicke eines Knotens
    const testweite = parent.innerWidth;
    //console.log("Die ermittelte Weite ist:" + testweite);

    const svg = d3.select("#graph") // Größe u. Grenzen SVG
      .append("svg")
      .attr("width", width + '%')
      .attr("height", height+'%')
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



    const colors = d3.scaleOrdinal(d3.schemeCategory10); // Automatische Zuteilung von Farben für die Nodes

    svg.append('defs').append('marker')
      .attr("id", 'arrowhead')
      .attr('viewBox', '-0 -5 10 10') //Koordinatensystem
      .attr('refX', rad + nodeborder) // Position Pfeilspitze in Abh. v. Radius und Umrandung der Knoten
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 13)
      .attr('markerHeight', 13)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');




// ##### DATA ######


    /*const data = {
      "nodes": [
        {
          "id": 1,
          "name": "ModulA",
          "group": 1
        },
        {
          "id": 2,
          "name": "ModulB",
          "group": 2
        },
        {
          "id": 3,
          "name": "ModulC",
          "group": 3

        }, {
          "id": 4,
          "name": "cap11",
          "group": 1
        },
        {
          "id": 5,
          "name": "cap12",
          "group": 1
        },
        {
          "id": 6,
          "name": "cap21",
          "group": 2
        }
      ],
      "links": [

        {
          "source": 1,
          "target": 4,
          "type": "is_a"
        },
        {
          "source": 1,
          "target": 5,
          "type": "has"
        },
        {
          "source": 2,
          "target": 6,
          "type": "has"
        }
      ]
    }
*/
var receivedData= this.moduleService.getAllModulesWithCapabilitiesAndSkills();
    var group=0;
    var moduleId=0;
    var capabilityId=100;
    var inputId=1000;
    var outputId=10000;
    var skillId=100000;
    var typeId=1000000;
    var data= {nodes:[], links:[]};
   //################################################ 
    receivedData.forEach(modul => {
      moduleId++;
      group++;
      data.nodes.push({
        "id" : moduleId,
        "name": modul.name,
        "group": 1
      });
      modul.capabilities.forEach(capability=>{
      capabilityId++;
      data.nodes.push({
        "id" : capabilityId,
        "name": capability.name,
        "group": 2
       })
      data.links.push({
        "source": moduleId,
        "target": capabilityId,
        "type": "has_capability"
      })
      capability.hasInput.forEach(input=>{
        inputId++;
        typeId++;
        data.nodes.push({
          "id" : inputId,
          "name": input.name,
          "group": 3
         })
         data.links.push({
          "source": capabilityId,
          "target": inputId,
          "type": "has_input"
        })  
        data.nodes.push({
          "id": typeId,
          "name": input.stateType,
          "group": 6
        })
        data.links.push({
          "source": inputId,
          "target": typeId,
          "type": "is_state_type"
        })
       })
       capability.hasOutput.forEach(output=>{
        outputId++;
        typeId++;
        data.nodes.push({
          "id" : outputId,
          "name": output.name,
          "group": 4
         })
         data.links.push({
          "source": capabilityId,
          "target": outputId,
          "type": "has_output"
        })  

        data.nodes.push({
          "id": typeId,
          "name": output.stateType,
          "group": 6
        })
        data.links.push({
          "source": outputId,
          "target": typeId,
          "type": "is_state_type"
        })

       })
       capability.executableViaSkill.forEach(skill=>{
        skillId++;
        data.nodes.push({
          "id" : skillId,
          "name": skill.name,
          "group": 5
         })
         data.links.push({
          "source": capabilityId,
          "target": skillId,
          "type": "executable_via_Skill"
        })  
       })

      })
    
    });
// ##################################################

    console.log(data);

    const link = svg // Links initialisieren
      .selectAll(".links")
      .data(data.links)
      .enter()
      .append("line")
      .style("stroke", "#aaa")
      .attr("class", "links")
      .attr('marker-end', 'url(#arrowhead)')
      ;
    link.append("title")
      .text(function (d) { return d.type });
    const node = svg // Nodes initialisieren
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", rad)
      .on('mouseover', function(){
        d3.select(this).transition()
        .duration('2')
        .attr('r', rad+5)
      })
      .on('mouseout', function(){
        d3.select(this).transition()
        .attr('r', rad)
      })
      .style("fill", "white")
      .style("stroke-width", nodeborder)
      .style("stroke", function (d) { return colors(d.group); }) // Node-Farben nach Gruppenzugehörigkeit
      /*.append ("text") // name als text neben node
        .attr ("dx", 12)
        .attr ("dy", ".35em")
        .text(function(d){return d.name})*/
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged));
    ;

    const text = svg
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")

      .text(function (d) { return d.name });

    const linkText = svg
      .selectAll("links")
      .data(data.links)
      .enter()
      .append("text")
      .style("fill", "#999")
      .text(function (d) { return d.type });



    


    const ticked = () => {
      const centerWidth=  this.svgContainer.nativeElement.offsetWidth/2;
      const centerHeight= this.svgContainer.nativeElement.offsetHeight/2;

     // data.nodes.indexOf[0].fx= centerWidth;
      //data.nodes.indexOf[0].fy= centerHeight;
      text
        .attr("dx", (d)=>{
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetWidth;
          const relativeDragX=100* d.x / this.svgContainer.nativeElement.offsetWidth;
          return Math.max(0 + relativeRad, Math.min(relativeDragX + 1.5, width - 5*relativeRad))+'%'})
        .attr("dy",  (d) => {
          const relativeDragY=100* d.y / this.svgContainer.nativeElement.offsetHeight;
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetHeight;
          return Math.max(0 + relativeRad, Math.min(relativeDragY, height - 5*relativeRad))+'%' })

      linkText
        .attr("dx", (d)=>{
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

      link   // Anfang und Ende der Links / Bestimmung der Position   nachfolgend Closure-Funtktionen um Zugriff mit this. außerhalb der Funktion
        .attr("x1",  (d)=> {
          d.source.x= Math.max(0 + rad, Math.min(d.source.x, this.svgContainer.nativeElement.offsetWidth - 5*rad));
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetWidth; // Umwandlung des Radius in relative Zahl (in % !)
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

      node // Bestimmung der Postion einzelner Nodes
        .attr("cx", (d) => {
          d.x=Math.max(0 + rad, Math.min(d.x, this.svgContainer.nativeElement.offsetWidth - 5*rad))
          const relativeRad =100* rad / this.svgContainer.nativeElement.offsetWidth;
          const relativeDragX=100* d.x / this.svgContainer.nativeElement.offsetWidth;
          return relativeDragX+'%';
        }) // Zentrum der Node-kreise, Maximxaler Wert begrenzt auf Fenstergröße
        .attr("cy", (d) => {
          d.y= Math.max(0 + rad, Math.min(d.y, this.svgContainer.nativeElement.offsetHeight - 5*rad))
          const relativeRad = 100* rad / this.svgContainer.nativeElement.offsetWidth;
          const relativeDragY=100* d.y / this.svgContainer.nativeElement.offsetHeight;
          return relativeDragY+'%';})
    }

    const simulation = d3.forceSimulation(data.nodes)     //Simulation
      .force("link", d3.forceLink()
        .id(function (d) { return d.id; })
        .distance(300)
        .links(data.links)
      )
      .force("charge", d3.forceManyBody().strength(-550)) // Anziehungskraft bzw. Abstoßen 
      .force("center", d3.forceCenter(this.svgContainer.nativeElement.offsetWidth/2, this.svgContainer.nativeElement.offsetHeight/2)) //Zentrierung der Nodes
        

         
     
      .on("tick", ticked); // tick wird in jedem Schritt durchgeführt

    function ended() {
      //console.log("ended");
    }
    function mouseover(){
      d3.select(this).select("circle").transition()
        .duration(750)
        .attr("r", rad+10)
    }

    function mouseout(){
      d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", rad)
    }
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
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
