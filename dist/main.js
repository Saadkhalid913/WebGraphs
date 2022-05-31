/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./ts/graph.ts
var GetCost = function (x) { return x[1]; };
var GraphNode = /** @class */ (function () {
    function GraphNode(NodeValue) {
        this.NodeValue = NodeValue;
    }
    return GraphNode;
}());
var GraphEdge = /** @class */ (function () {
    function GraphEdge(ToNode, Cost) {
        this.ToNode = ToNode;
        this.Cost = Cost;
    }
    GraphEdge.GetEdgeCost = function (Edge) { return Edge.Cost; };
    return GraphEdge;
}());
var PriorityQueue = /** @class */ (function () {
    function PriorityQueue(cost_function) {
        this.items = [];
        this.cost_function = cost_function;
    }
    PriorityQueue.prototype.add = function (x) {
        if (this.items.length == 0) {
            this.items.push(x);
            return;
        }
        this.items.push(x);
        var i = 0;
        while ((this.cost_function(this.items[i]) < this.cost_function(x)) && i < this.items.length - 1) {
            i++;
        }
        this.items.splice(i, 0, x);
    };
    PriorityQueue.prototype.addMany = function (x) {
        for (var _i = 0, x_1 = x; _i < x_1.length; _i++) {
            var item = x_1[_i];
            this.add(item);
        }
    };
    PriorityQueue.prototype.removeMax = function () { return this.items.pop(); };
    PriorityQueue.prototype.removeMin = function () { return this.items.splice(0, 1)[0]; };
    PriorityQueue.prototype.isEmpty = function () { return (this.items.length === 0); };
    return PriorityQueue;
}());
var Graph = /** @class */ (function () {
    function Graph(number_of_nodes) {
        this.adjacency_list = new Map();
        this.NodeRefs = [];
        for (var i = 0; i < number_of_nodes; i++) {
            this.NodeRefs.push(new GraphNode(i));
            this.adjacency_list.set(i, []);
        }
        this.n_nodes = number_of_nodes;
    }
    Graph.prototype.addEdge = function (n1, n2, distance) {
        if (n1 > (this.n_nodes - 1) || n2 > (this.n_nodes - 1)) {
            throw new Error("Index out of bounds");
        }
        this.adjacency_list.get(n1).push(new GraphEdge(this.NodeRefs[n2], distance));
        this.adjacency_list.get(n2).push(new GraphEdge(this.NodeRefs[n1], distance));
    };
    Graph.prototype.shortestPath = function (n1, n2) {
        var distances = [];
        for (var i = 0; i < this.n_nodes; i++) {
            distances[i] = Number.MAX_SAFE_INTEGER;
        }
        distances[n1] = 0;
        var visited = new Set();
        var Q = new PriorityQueue(GraphEdge.GetEdgeCost);
        Q.add(new GraphEdge(this.NodeRefs[n1], 0));
        var _loop_1 = function () {
            var CurEdge = Q.removeMin();
            var node = CurEdge.ToNode, priority = CurEdge.Cost;
            visited.add(CurEdge.ToNode);
            console.log("POPPED: ".concat(node, " ").concat(priority));
            var neighbors = this_1.adjacency_list.get(node.NodeValue);
            neighbors.forEach(function (edge) {
                var neighbor = edge.ToNode;
                var cost = edge.Cost;
                if (visited.has(neighbor)) {
                    return;
                }
                if (distances[node.NodeValue] + cost < distances[neighbor.NodeValue]) {
                    distances[neighbor.NodeValue] = distances[node.NodeValue] + cost;
                }
                Q.add(new GraphEdge(neighbor, cost));
            });
        };
        var this_1 = this;
        while (!Q.isEmpty()) {
            _loop_1();
        }
        return distances[n2];
    };
    return Graph;
}());
/* harmony default export */ const graph = ((/* unused pure expression or super */ null && (Graph)));
var G = new Graph(5);
G.addEdge(0, 1, 1);
G.addEdge(0, 2, 7);
G.addEdge(0, 1, 8);
G.addEdge(1, 2, 12);
G.addEdge(2, 4, 4);
G.addEdge(2, 4, 1);
G.addEdge(1, 3, 8);
G.addEdge(1, 4, 1);
G.addEdge(2, 3, 6);
function main() {
    console.log(G.shortestPath(0, 2));
    console.log(G);
}

;// CONCATENATED MODULE: ./ts/index.ts
// const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
// const ctx = canvas.getContext("2d")

function render() {
    // do something
}
main();

/******/ })()
;