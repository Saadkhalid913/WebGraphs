type DistanceTuple = [number, number] // [node, distance]
const GetCost = (x: DistanceTuple) => x[1]

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
    private adjacency_list: Map<number, DistanceTuple[]> = new Map()
    private n_nodes: number 

    constructor(number_of_nodes: number) {
        for (let i = 0; i < number_of_nodes; i++) {
            this.adjacency_list.set(i, [])
        }
        this.n_nodes = number_of_nodes
    }


    addEdge(n1: number, n2: number, distance: number) {
        if (n1 > (this.n_nodes - 1) || n2 > (this.n_nodes - 1)) { throw new Error("Index out of bounds") }
        this.adjacency_list.get(n1).push([n2,distance])
        this.adjacency_list.get(n2).push([n1,distance])
    }

    shortestPath(n1: number, n2: number) {
        const distances: number[] = []
        for (let i = 0; i< this.n_nodes ;i++) { distances[i] = Number.MAX_SAFE_INTEGER }
        distances[n1] = 0

        const visited = new Set<number>()
        const Q = new PriorityQueue<DistanceTuple>(GetCost)
        Q.add([n1, 0])

        while (!Q.isEmpty()) {

            const [node, priority] = Q.removeMin();
            visited.add(node)
            console.log(`POPPED: ${node} ${priority}`)
            const neighbors = this.adjacency_list.get(node);
            neighbors.forEach(edge => {
                const neighbor = edge[0] 
                const cost = edge[1]

                if (visited.has(neighbor)) {
                    return
                }

                if (distances[node] + cost < distances[neighbor]) {
                    distances[neighbor] = distances[node] + cost   
                }
                Q.add([neighbor, cost])
            })
        }
        return distances[n2]
    }
}


const G = new Graph(5)
G.addEdge(0,1,1)
G.addEdge(0,2,7)
G.addEdge(0,1,8)
G.addEdge(1,2,12)
G.addEdge(2,4,4)
G.addEdge(2,4,1)
G.addEdge(1,3,8)
G.addEdge(1,4,1)
G.addEdge(2,3,6)

export function main() {
    console.log(G.shortestPath(0,2))
    // console.log("----------------")
    // const Q = new PriorityQueue<DistanceTuple>(GetCost) 
    // for (let i = 0; i < 10; i++) {
    //     Q.add([1,Math.floor(Math.random() * 100 + 1)])
    // }
    // for (let i = 0; i< 10; i++) console.log(Q.removeMin())
}



