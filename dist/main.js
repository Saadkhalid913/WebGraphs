/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./ts/CanvasElements.ts
var BaseCanvasElement = /** @class */ (function () {
    function BaseCanvasElement() {
    }
    BaseCanvasElement.prototype.draw = function (ctx) {
    };
    return BaseCanvasElement;
}());


;// CONCATENATED MODULE: ./ts/graph.ts
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var GetCost = function (x) { return x[1]; };
var GraphNode = /** @class */ (function (_super) {
    __extends(GraphNode, _super);
    function GraphNode(NodeValue, x, y) {
        var _this = _super.call(this) || this;
        _this.NodeValue = NodeValue;
        _this.x = x;
        _this.y = y;
        return _this;
    }
    GraphNode.prototype.draw = function (ctx) {
        var _a = this, x = _a.x, y = _a.y;
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, 40, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.font = "15px Arial";
        ctx.fillText(this.NodeValue.toString(), x - 7.5, y + 7.5);
        ctx.closePath();
    };
    return GraphNode;
}(BaseCanvasElement));

var GraphEdge = /** @class */ (function () {
    function GraphEdge(ToNode, Cost, FromNode) {
        this.ToNode = ToNode;
        this.Cost = Cost;
        this.FromNode = FromNode;
    }
    GraphEdge.GetEdgeCost = function (Edge) { return Edge.Cost; };
    GraphEdge.prototype.draw = function (ctx) {
        console.log("Drawing...", this);
        var _a = this.FromNode, x1 = _a.x, y1 = _a.y;
        var _b = this.ToNode, x2 = _b.x, y2 = _b.y;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };
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
    function Graph() {
        this.adjacency_list = new Map();
        this.n_nodes = 0;
        this.NodeRefs = [];
        this.EdgeRefs = [];
    }
    Graph.prototype.addNode = function (x, y) {
        var n = this.n_nodes;
        var NewNode = new GraphNode(n, x, y);
        this.adjacency_list.set(n, []);
        this.NodeRefs[n] = NewNode;
        this.n_nodes++;
        return NewNode;
    };
    Graph.prototype.addEdge = function (n1, n2, distance) {
        if (n1 > (this.n_nodes - 1) || n2 > (this.n_nodes - 1)) {
            throw new Error("Index out of bounds");
        }
        var E1 = new GraphEdge(this.NodeRefs[n2], distance, this.NodeRefs[n1]);
        var E2 = new GraphEdge(this.NodeRefs[n1], distance, this.NodeRefs[n2]);
        this.EdgeRefs.push(E1, E2);
        this.adjacency_list.get(n1).push(E1);
        this.adjacency_list.get(n2).push(E2);
        return [E1, E2];
    };
    Graph.prototype.shortestPath = function (n1, n2) {
        var distances = [];
        for (var i = 0; i < this.n_nodes; i++) {
            distances[i] = Number.MAX_SAFE_INTEGER;
        }
        distances[n1] = 0;
        var visited = new Set();
        var Q = new PriorityQueue(GraphEdge.GetEdgeCost);
        Q.add(new GraphEdge(this.NodeRefs[n1], 0, this.NodeRefs[n1]));
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
                Q.add(new GraphEdge(neighbor, cost, CurEdge.ToNode));
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
/* harmony default export */ const graph = (Graph);
var G = new Graph();
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
function main() {
    console.log(G.shortestPath(0, 2));
    console.log(G);
}

;// CONCATENATED MODULE: ./ts/index.ts
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var ts_G = new graph();
var Nodes = [];
function HandleCanvasClickEvent(e) {
    var x = e.clientX;
    var y = e.clientY;
    var Node = ts_G.addNode(x, y);
    Node.draw(ctx);
    Nodes.push(Node);
}
canvas.addEventListener("click", HandleCanvasClickEvent);
var edges = [];
document.getElementById("go").addEventListener("click", function () {
    edges.push.apply(edges, ts_G.addEdge(0, 1, 10));
    edges.forEach(function (e) { return e.draw(ctx); });
    Nodes.forEach(function (n) { return n.draw(ctx); });
});

/******/ })()
;