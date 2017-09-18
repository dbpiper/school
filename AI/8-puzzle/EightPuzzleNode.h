// EightPuzzleNode.h
#ifndef EIGHT_PUZZLE_NODE_H
#define EIGHT_PUZZLE_NODE_H

#include <set>

#include "EightPuzzleBoard.h"
#include "Constants.h"
#include "EightPuzzleNodeManager.h"
#include "CompareBoard.h"

using namespace std;

class EightPuzzleNodeManager;

class EightPuzzleNode
{
    unsigned int id;
    EightPuzzleBoard board;
    int steps;
    int score; // f(x) = g(x) + h(x)
    EightPuzzleNodeManager &manager;


    // see Constants.h for overview of each
    // of the heuristics
    int calculateHeuristicZero();
    int calculateHeuristicDisplacement();
    int calculateHeuristicManhattan();
    int calculateHeuristicTilesOutRowCol();
public: 
    EightPuzzleNode* parent;
 static unsigned int nextId;
 static bool comparisonFunction(
      EightPuzzleNode* node1, EightPuzzleNode* node2);
    // create a node from scratch
    EightPuzzleNode(EightPuzzleNode* parent,
        EightPuzzleBoard board,
        EightPuzzleNodeManager& manager);
    // make a node by advancing the parent by a move
    EightPuzzleNode(EightPuzzleNode* parent,
        EightPuzzleMove move);
    int calculateHeuristicScore();
    void setSteps(int steps);
    int getSteps();
    vector<EightPuzzleNode*> getSuccessors(set<EightPuzzleNode*,
        CompareBoard> closed); 
    void setId();
    // compare two nodes returns 0 if equal
    // -1 if this node is "less than" the other node
    //  1 if this node is "greater than" the other node
    int compareToNode(EightPuzzleNode& node);
    int getScore();
    unsigned int getId();
    bool isGoal();
    string toString();
    void printNode();
    void printNodeDebug();
    bool areBoardsSame(EightPuzzleNode& node);
    EightPuzzleBoard getBoard();
};

#endif
