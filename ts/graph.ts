import { BaseCanvasElement } from "./CanvasElements"
type DistanceTuple = [number, number] // [node, distance]
const GetCost = (x: DistanceTuple) => x[1]


export class GraphNode extends BaseCanvasElement {
    readonly NodeValue: number;
    private Highlight: boolean = false
    readonly x: number; 
    readonly y: number;

    constructor(NodeValue: number, x: number, y: number) {
        super() 
        this.NodeValue = NodeValue
        this.x = x;
        this.y = y;
    }
    setHighlight(s: boolean) { this.Highlight = s}

    draw(ctx: CanvasRenderingContext2D) {
        const { x,y } = this
        ctx.fillStyle = this.Highlight ? 'blue' : 'red'
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.arc(x,y,40,0, 2 * Math.PI, false);
        ctx.fill()
        ctx.closePath();
        
        ctx.beginPath();
        ctx.fillStyle = "#000000"
        ctx.font = "15px Arial";
        ctx.fillText(this.NodeValue.toString(), x - 7.5 , y + 7.5)
        ctx.closePath();
    }
}

export class GraphEdge {
    readonly ToNode: GraphNode;
    readonly Cost: number;
    readonly FromNode: GraphNode;
    private Highlight: boolean = false

    constructor(ToNode: GraphNode, Cost: number, FromNode: GraphNode) {
        this.ToNode = ToNode;
        this.Cost = Cost;
        this.FromNode = FromNode
    }

    static GetEdgeCost(Edge: GraphEdge) { return Edge.Cost }

    setHighlight(s: boolean) { this.Highlight = s}

    draw(ctx: CanvasRenderingContext2D) {
        console.log("Drawing...", this)
        let {x: x1, y: y1} = this.FromNode;
        let {x: x2, y: y2} = this.ToNode;


        ctx.strokeStyle = this.Highlight ? 'blue' : 'red';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

    }

}



class PriorityQueue<T> {
    readonly items: T[]
    readonly cost_function: (x:T) => number
    constructor(cost_function: (x: T) => number) {
        this.items = []
        this.cost_function = cost_function
    }

    add(x: T) {
        if (this.items.length == 0) { 
            this.items.push(x);
            return;
        }
        
        this.items.push(x);
        let i = 0;
        while ((this.cost_function(this.items[i]) < this.cost_function(x)) && i < this.items.length -1) { i++; }
        this.items.splice(i, 0, x)
    }

    addMany(x: T[]) {
        for (let item of x) {
            this.add(item)
        }
    }

    removeMax() { return this.items.pop() }
    removeMin() { return this.items.splice(0, 1)[0] }
    isEmpty() { return (this.items.length === 0) }
}

export default class Graph {
    private adjacency_list: Map<number, GraphEdge[]> = new Map()
    private n_nodes: number = 0;
    readonly NodeRefs: GraphNode[] = []
    readonly EdgeRefs: GraphEdge[] = []

    addNode(x:number, y: number) {
        const n = this.n_nodes
        const NewNode = new GraphNode(n,x,y);
        this.adjacency_list.set(n, []);
        this.NodeRefs[n] = NewNode;
        this.n_nodes++;
        return NewNode
    }

    addEdge(n1: number, n2: number, distance: number) {
        if (n1 > (this.n_nodes - 1) || n2 > (this.n_nodes - 1)) { throw new Error("Index out of bounds") }

        const E1 = new GraphEdge(this.NodeRefs[n2], distance, this.NodeRefs[n1])
        const E2 = new GraphEdge(this.NodeRefs[n1], distance, this.NodeRefs[n2])

        this.EdgeRefs.push(E1,E2)

        this.adjacency_list.get(n1).push(E1)
        this.adjacency_list.get(n2).push(E2)

        return [E1,E2]
    }

    shortestPath(n1: number, n2: number) {
        const distances: number[] = []
        for (let i = 0; i< this.n_nodes ;i++) { distances[i] = Number.MAX_SAFE_INTEGER }
        const PrevEdges = new Map<GraphNode, GraphEdge>()
        distances[n1] = 0

        const visited = new Set<GraphNode>()
        const Q = new PriorityQueue<GraphEdge>(GraphEdge.GetEdgeCost)
        Q.add(new GraphEdge(this.NodeRefs[n1], 0, this.NodeRefs[n1]))

        while (!Q.isEmpty()) {

            const CurEdge = Q.removeMin();
            const {ToNode: node, Cost: priority} = CurEdge
            visited.add(CurEdge.ToNode)
            console.log(`POPPED: ${node} ${priority}`)
            const neighbors = this.adjacency_list.get(node.NodeValue);
            neighbors.forEach((edge: GraphEdge) => {
                const neighbor = edge.ToNode
                const cost = edge.Cost

                if (visited.has(neighbor)) {
                    return
                }

                if (distances[node.NodeValue] + cost < distances[neighbor.NodeValue]) {
                    distances[neighbor.NodeValue] = distances[node.NodeValue] + cost   
                    PrevEdges.set(neighbor, CurEdge)
                }
                Q.add(new GraphEdge(neighbor, cost, CurEdge.ToNode))
            })
        }

        let V_Node = this.NodeRefs[n2]
        const Edges: GraphEdge[] = []
        while (V_Node !== this.NodeRefs[n1]) {
            const PrevEdge = PrevEdges.get(V_Node);
            const PrevNode = PrevEdge.FromNode;
            V_Node = PrevNode
            Edges.push(PrevEdge)
        }
        return [distances[n2], Edges]
    }
}


const G = new Graph()


// for (let i = 0; i< 5; i++) { 
//     G.addNode();
// }
// G.addEdge(0,1,1)
// G.addEdge(0,2,7)
// G.addEdge(0,1,8)
// G.addEdge(1,2,12)
// G.addEdge(2,4,4)
// G.addEdge(2,4,1)
// G.addEdge(1,3,8)
// G.addEdge(1,4,1)
// G.addEdge(2,3,6)

export function main() {
    console.log(G.shortestPath(0,2))
    console.log(G)
}
