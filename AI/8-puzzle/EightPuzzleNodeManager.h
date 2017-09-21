// EightPuzzleNodeManager.h
#ifndef EIGHT_PUZZLE_NODE_MANAGER_H
#define EIGHT_PUZZLE_NODE_MANAGER_H

#include <vector>

#include "Constants.h"
#include "EightPuzzleNode.h"

using namespace std;

class EightPuzzleNode;

class EightPuzzleNodeManager
{
    vector<EightPuzzleNode*> nodes;
public:
    SelectedHeuristic heuristic;

    EightPuzzleNodeManager(int heuristic);
    ~EightPuzzleNodeManager();

    // new node from scratch debugging
    EightPuzzleNode* newNode(EightPuzzleNode* parent,
        EightPuzzleBoard board, int score);
    // new node from scratch
    EightPuzzleNode* newNode(EightPuzzleNode* parent,
        EightPuzzleBoard board);
    // make a new node by advancing the parent by a move
    EightPuzzleNode* newNode(EightPuzzleNode* parent,
        EightPuzzleMove move);
};

#endif
