// EightPuzzleNodeManager.cpp

#include "EightPuzzleNodeManager.h"

EightPuzzleNodeManager::EightPuzzleNodeManager(int heuristic)
{
    this->heuristic =
        static_cast<SelectedHeuristic>(heuristic);
}

// new node from scratch
EightPuzzleNode*
    EightPuzzleNodeManager::newNode(EightPuzzleNode* parent,
    EightPuzzleBoard board)
{
    EightPuzzleNode* newNode = new EightPuzzleNode(parent, board, (*this));
    nodes.push_back(newNode);
    return newNode;
}

// new node by advancing the parent by a move
EightPuzzleNode*
    EightPuzzleNodeManager::newNode(EightPuzzleNode* parent,
    EightPuzzleMove move, vector<EightPuzzleNode*> closed)
{
    // check if on closed list
    bool onClosed = false;
    for (int i = 0; i < closed.size(); i++) {
        EightPuzzleBoard board = parent->getBoard();
        board.makeMove(move);
        // is not in the closed list
        if (!board.isEqualTo(closed.at(i)->getBoard())) {
            
        }
    }

    EightPuzzleNode* newNode = new EightPuzzleNode(parent, move);
    nodes.push_back(newNode);
    return newNode;
}

EightPuzzleNodeManager::~EightPuzzleNodeManager()
{
    for (int i = 0; i < nodes.size(); i++) {
        delete nodes.at(i);
    }
}
