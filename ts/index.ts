const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")

import Graph, { main, GraphNode, GraphEdge } from "./graph"


const G = new Graph()
const Nodes: GraphNode[] = []
function HandleCanvasClickEvent(e: MouseEvent) {
    const x = e.clientX;
    const y = e.clientY;
    const Node = G.addNode(x,y);
    Node.draw(ctx);
    Nodes.push(Node)
}   


canvas.addEventListener("click", HandleCanvasClickEvent)



const edges: GraphEdge[] = []
document.getElementById("go").addEventListener("click", () => {
    AddEdgeAndRender(0,1,10)
})

function AddEdgeAndRender(a: number,b:number,d: number) {
    edges.push(...G.addEdge(a,b,d))
    edges.forEach(e => e.draw(ctx))
    Nodes.forEach(n => n.draw(ctx))
}