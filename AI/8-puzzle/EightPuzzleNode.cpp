// EightPuzzleNode.cpp

#include "EightPuzzleNode.h"

using namespace std;

unsigned int EightPuzzleNode::nextId = 0;

// returns whether or not node1 < node2
bool EightPuzzleNode::comparisonFunction(
    EightPuzzleNode* node1, EightPuzzleNode* node2)
{
    if (node1->areBoardsSame((*node2))) {
        return false;
    } else if (node1->getScore() < node2->getScore()) {
        return true;
    } else if (node1->getScore() > node2->getScore()) {
        return false;
    } else { // if (score == node.getScore())
       if (node1->getId() < node2->getId()) {
            return true;
       } else { // id is greater (likely) 
                // or same (shouldn't happen)
            return false;
       }
    }
    
}

// create a node from scratch
EightPuzzleNode::EightPuzzleNode(EightPuzzleNode*
    parent, EightPuzzleBoard board, EightPuzzleNodeManager& manager) :
        parent(parent), board(board), steps(steps), manager(manager)
{
    // score is steps + heuristic score
    score = steps + calculateHeuristicScore(); 
    setId();
}

// make a node by advancing the parent by a move
EightPuzzleNode::EightPuzzleNode(EightPuzzleNode*
    parent, EightPuzzleMove move) : parent(parent),
    board(parent->board), manager(parent->manager)
{
    // make the move which makes this a unique node
    board.makeMove(move);  
    // take a step
    setSteps(parent->getSteps() + 1);
    // score is steps + heuristic score
    score = steps + calculateHeuristicScore();
    setId();
}

void EightPuzzleNode::setId()
{
    id = EightPuzzleNode::nextId;
    EightPuzzleNode::nextId++;
}

int EightPuzzleNode::calculateHeuristicScore()
{
    switch (manager.heuristic)
    {
        case Zero:
            return calculateHeuristicZero();
        break;
        case Displacement:
            return calculateHeuristicDisplacement();
        break;
        case Manhattan:
            return calculateHeuristicManhattan();
        break;
        case TilesOutRowCol:
            return calculateHeuristicTilesOutRowCol();
        break;
    }
}

void EightPuzzleNode::setSteps(int steps)
{
    this->steps = steps;
}

int EightPuzzleNode::getSteps()
{
    return steps;
}

int EightPuzzleNode::calculateHeuristicZero()
{
    return 0;
}

int EightPuzzleNode::calculateHeuristicDisplacement()
{
    int score = 0;
    // goal board
    vector< vector<int> > goalPieces = 
        { {0, 1, 2}, 
          {3, 4, 5},
          {6, 7, 8} 
        };
    EightPuzzleBoard goal{goalPieces};

    vector< vector<int> > myPieces = board.getPieces();
    
    for (int i = 0; i < myPieces.size(); i++) {
        for (int j = 0; j < myPieces.at(i).size(); j++) {
            if (goalPieces.at(i).at(j) != myPieces.at(i).at(j)) {
                score++;
            }
        }
    }

    return score;
}

int EightPuzzleNode::calculateHeuristicManhattan()
{
    int score = 0;
    // TODO: write function for manhattan
    return score;
}

int EightPuzzleNode::calculateHeuristicTilesOutRowCol()
{
    int score = 0;
    // TODO: write function for tiles out row col
    return score;
}

vector<EightPuzzleNode*> EightPuzzleNode::getSuccessors(vector<EightPuzzleNode*> closed)
{
    vector<EightPuzzleNode*> successors;
    vector<EightPuzzleMove> validMoves = board.validMoves();
    for (int i = 0; i < validMoves.size(); i++) {
        bool onClosed = false;
        for (int j = 0; j < closed.size(); j++) {
            EightPuzzleBoard board = parent->getBoard();
            board.makeMove(validMoves.at(i));
            // its in the closed list 
            if (board.isEqualTo(closed.at(j)->getBoard())) {
                onClosed = true;
            }
        }
        // if its not closed go ahead and create it
        if (!onClosed) {
            successors.push_back(
                manager.newNode(
                    this, validMoves.at(i), closed
                )
            );
        }
    }
    return successors;
}

bool EightPuzzleNode::areBoardsSame(EightPuzzleNode& node)
{
    return board.getPieces() == node.board.getPieces();
}

int EightPuzzleNode::getScore()
{
    return score;
}

unsigned int EightPuzzleNode::getId()
{
    return id;
}

// compare two nodes:
// returns  0 if equal
// returns -1 if this node is "less than" the other node
// returns  1 if this node is "greater than" the other node
int EightPuzzleNode::compareToNode(EightPuzzleNode& node)
{
    if (areBoardsSame(node)) {
        return 0;
    } else if (score < node.getScore()) {
        return -1;
    } else if (score > node.getScore()) {
        return 1;
    } else { // if (score == node.getScore())
       if (id < node.id) {
            return -1;
       } else { // id is greater (likely) 
                // or same (shouldn't happen)
            return 1;
       }
    }
}

bool EightPuzzleNode::isGoal()
{
    // goal board
    vector< vector<int> > goalPieces = 
        { {0, 1, 2}, 
          {3, 4, 5},
          {6, 7, 8} 
        };
    EightPuzzleBoard goal{goalPieces};
    return board.getPieces() == goal.getPieces();
}

string EightPuzzleNode::toString()
{
    string strNode = "";
    strNode += '\n' + board.toString() + '\n';
    return strNode;
}

void EightPuzzleNode::printNode()
{
    string strNode = toString();
    cout << strNode << endl;
}

EightPuzzleBoard EightPuzzleNode::getBoard()
{
    return board;
}
