
export class D3GraphData {
    // nodes: D3Node [] = [];
    // links: D3Link[] = [];
    constructor(private nodes: D3Node[] = [], private links: D3Link[] = []) { }

    addNode(node: D3Node): void {
        this.nodes.push(node);
    }

    addLink(link: D3Link): void {
        this.links.push(link);
    }
}


export class D3Node {
    constructor(
        private id: string,
        private name: string,
        private group: number) { }
}

export class D3Link {
    constructor(
        private source: string,
        private target: string,
        private type: string) { }
}
