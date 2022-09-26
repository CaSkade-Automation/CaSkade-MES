
import * as d3Force from 'd3-force';

export enum NodeType {
    None = "None",
    Module ="D3ModuleNode",
    Skill = "D3SkillNode",
    Capability = "D3CapabilityNode",
    Input = "D3InputNode",
    Output = "D3OutputNode"
}

export class D3Node implements d3Force.SimulationNodeDatum {
    index?: number | undefined;
    x?: number | undefined;
    y?: number | undefined;
    vx?: number | undefined;
    vy?: number | undefined;
    fx?: number | null | undefined;
    fy?: number | null | undefined;

    constructor(
        public id: string,
        public name: string,
        public type: NodeType = NodeType.None,
        x?, y?) {
        this.x = x;
        this.y = y;
    }
}

export class D3ModuleNode extends D3Node {
    constructor(id: string, name: string) {
        super(id, name, NodeType.Module);
    }
}
export class D3SkillNode extends D3Node{
    constructor(id: string, name: string) {
        super(id, name, NodeType.Skill);
    }
}

export class D3CapabilityNode extends D3Node{
    constructor(id: string, name: string) {
        super(id, name, NodeType.Capability);
    }
}

export class D3InputNode extends D3Node{
    constructor(id: string, name: string) {
        super(id, name, NodeType.Input);
    }
}

export class D3OutputNode extends D3Node{
    constructor(id: string, name: string) {
        super(id, name, NodeType.Output);
    }
}

export class D3Link implements d3Force.SimulationLinkDatum<D3Node> {
    constructor(
        public source: D3Node,
        public target: D3Node,
        public type: string) { }
}


export class D3GraphData {
    constructor(
        public nodes: D3Node[] = [],
        public links: D3Link[] = [])
    { }

    addNode(node: D3Node): void {
        this.nodes.push(node);
    }

    addLink(link: D3Link): void {
        this.links.push(link);
    }

    addData(data: D3GraphData): void {
        data.nodes.forEach(node => this.addNode(node));
        data.links.forEach(link => this.addLink(link));
    }

    getNodesById(id: string): D3Node[] {
        return this.nodes.filter(node => node.id == id);
    }

    getNodesByNodeTyp(type: string): D3Node[] {
        return this.nodes.filter(node => node.type === type);
    }


    // Adds another D3GraphData object to the current one
    appendAndConnectData(data: D3GraphData, idToConnectTo: string, nodeType: NodeType, connectionType: string): void {
        const newNodes = data.nodes;
        const newLinks = data.links;
        // Add the new data
        newNodes.forEach(newNode => this.addNode(newNode));
        newLinks.forEach(newLink => this.addLink(newLink));
        // Connect with existing nodes
        const oldNodesToConnect = this.getNodesById(idToConnectTo);
        const newNodesToConnect = this.getNodesByNodeTyp(nodeType);

        oldNodesToConnect.forEach(oldNode => {
            newNodesToConnect.forEach(newNode => {
                this.addLink(new D3Link(oldNode, newNode, connectionType));
            });
        });
    }
}
