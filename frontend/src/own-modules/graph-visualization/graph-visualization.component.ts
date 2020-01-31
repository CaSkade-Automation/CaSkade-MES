import { Component, AfterContentInit, ViewEncapsulation } from '@angular/core';
import * as d3 from "d3"
import { enterView } from '@angular/core/src/render3/state';
import { pathToFileURL } from 'url';

@Component({
  selector: 'graph-visualization',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './graph-visualization.component.html',
  styleUrls: ['./graph-visualization.component.scss']
})
export class GraphVisualizationComponent implements AfterContentInit {

  ngAfterContentInit(): void { 
    const margin = {top: 10, right: 30, bottom: 30, left: 40}; // Definition der Größen
 const width = 1400 - margin.left - margin.right;
 const height = 900 - margin.top - margin.bottom;
 const rad=20 // Radius eines Knotens
 const nodeborder =8; // Umrandungsdicke eines Knotens



const svg = d3.select("#graph") // Größe u. Grenzen SVG
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
       
        

const colors = d3.scaleOrdinal(d3.schemeCategory10); // Automatische Zuteilung von Farben für die Nodes

svg.append('defs').append('marker')
    .attr("id",'arrowhead')
    .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
     .attr('refX', rad + nodeborder) // Position Pfeilspitze in Abh. v. Radius und Umrandung der Knoten
     .attr('refY',0)
     .attr('orient','auto')
        .attr('markerWidth',13)
        .attr('markerHeight',13)
        .attr('xoverflow','visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999')
    .style('stroke','none');
        

//d3.json("\frontend\app\own-modules\graph-visualization\graph-data.json", function(input) {  // Input-Daten

const data = {
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
      "group":1
    },
    {
      "id": 5,
      "name": "cap12",
      "group":1
    },
    {
      "id": 6,
      "name": "cap21",
      "group":2
    }
  ],
  "links": [

    {
      "source": 1,
      "target": 4,
      "type": "is_a"
    } ,
    {
      "source": 1,
      "target": 5,
      "type": "has"
    } ,
    {
      "source": 2,
      "target": 6,
      "type":"has"
    } 
  ]
}



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
      .text(function(d){return d.type});
  const node = svg // Nodes initialisieren
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
      .attr("r", rad)
      .style( "fill", "white")
      .style("stroke-width", nodeborder) 
      .style("stroke",function(d){return colors(d.group);} ) // Node-Farben nach Gruppenzugehörigkeit
    /*.append ("text") // name als text neben node
      .attr ("dx", 12)
      .attr ("dy", ".35em")
      .text(function(d){return d.name})*/
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged));
; 
  
      const text =svg
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
     
      .text(function(d){return d.name});

      const linkText =svg
      .selectAll("links")
      .data(data.links)
      .enter()
      .append("text")
      .text(function (d){return d.type});

    
  
  const simulation = d3.forceSimulation(data.nodes)     //Simulation
      .force("link", d3.forceLink()                               
            .id(function(d) { return d.id; })  
            .distance(150)                   
            .links(data.links)                                    
      )
      .force("charge", d3.forceManyBody().strength(-200)) // Anziehungskraft bzw. Abstoßen 
      .force("center", d3.forceCenter(width / 2, height / 2))     // Nodes mittig von svg
      .on("tick", ticked); // tick wird in jedem Schritt durchgeführt

  
  function ticked() { 
    text
        .attr("dx", function(d) {
           return Math.max(0+rad, Math.min(d.x+23, width-rad)); })
        .attr("dy", function(d) { return Math.max(0+rad, Math.min(d.y, height-rad)); })
    
    linkText
         .attr("dx", function(d){return 0.5*((d.source.x)+(d.target.x))})
         .attr("dy", function(d){return 0.5*((d.source.y)+(d.target.y)) })
         


    link   // Anfang und Ende der Links / Bestimmung der Position
        .attr("x1", function(d) { return Math.max(0+rad, Math.min(d.source.x, width-rad)); }) // Postionen nur innerhalb des Fensters erlaubt
        .attr("y1", function(d) { return Math.max(0+rad,Math.min(d.source.y, height-rad)); })
        .attr("x2", function(d) { return Math.max(0+rad,Math.min(d.target.x, width-rad)); })
        .attr("y2", function(d) { return Math.max(0+rad, Math.min(d.target.y, height-rad)); });

    node // Bestimmung der Postion einzelner Nodes
         .attr("cx", function (d) { return Math.max(0+rad,Math.min(d.x, width-rad)); }) // Zertrum der Node-kreise, Maximxaler Wert begrenzt auf Fenstergröße
         .attr("cy", function(d) { return Math.max(0+rad, Math.min(d.y, height-rad)); });
  }

  function ended() {
    console.log("ended");
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    console.log(d)
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      //if (!d3.event.active) simulation.alphaTarget(0);
      //d.fx = null;
      //d.fy = null;
    }
    
     }
  constructor() { }

}
