const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")

import Graph, { main } from "./graph"


const G = new Graph()

function HandleCanvasClickEvent(e: MouseEvent) {
    const x = e.clientX;
    const y = e.clientY;
    const Node = G.addNode(x,y);
    Node.draw(ctx)
}   


canvas.addEventListener("click", HandleCanvasClickEvent)

document.getElementById("go").addEventListener("click", () => {
    const edges = G.addEdge(1,2,10)
    edges.forEach(e => e.draw(ctx))
   
})