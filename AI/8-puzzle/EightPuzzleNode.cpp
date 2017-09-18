// EightPuzzleNode.cpp

#include "EightPuzzleNode.h"

using namespace std;

unsigned int EightPuzzleNode::nextId = 0;

// returns whether or not node1 > node2
// false means 0 or -1
// true means 1
bool EightPuzzleNode::comparisonFunction(
    EightPuzzleNode* node1, EightPuzzleNode* node2)
{
    int comparison = node1->compareToNode((*node2));
    // 0 ==
    // not less than
    if (comparison == 0) {
        return false;
    } else if (comparison == 1) {
        return true;
        // is less than
    } else {
        return false;
    }
}

// node1 > node2
bool EightPuzzleNode::comparisonFunctionBoard(
    EightPuzzleNode* node1, EightPuzzleNode* node2)
{
    vector< vector<int> > node1Pieces =
        node1->getBoard().getPieces();
    vector< vector<int> > node2Pieces =
        node2->getBoard().getPieces();
    for (int i = 0; i < node1Pieces.size(); i++) {
        for (int j = 0; j < node1Pieces.size(); j++) {
            if (node1Pieces.at(i).at(j) < node2Pieces.at(i).at(j)) {
                return false;
            } else if (node1Pieces.at(i).at(j) == node2Pieces.at(i).at(j)) {
                return false;
            } else {
                return true;
            }
        }
    }
}

// less is better
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
       if (id < node.id) { //prefer newer nodes
            return 1; 
       } else { // id is greater (likely) 
                // or same (shouldn't happen)
            return -1;
       }
    }
}

// create a node from scratch
EightPuzzleNode::EightPuzzleNode(EightPuzzleNode*
    parent, EightPuzzleBoard board, EightPuzzleNodeManager& manager) :
        parent(parent), board(board), manager(manager) // steps = 0
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
            int currentNumber = myPieces.at(i).at(j);
            if (goalPieces.at(i).at(j) != myPieces.at(i).at(j)) {
                tuple<int, int> goalIndices =
                    goal.indicesOfElement(currentNumber);
                score += (abs(get<0>(goalIndices)-i)) +
                    (abs(get<1>(goalIndices)-j));
            }
        }
    }

    return score;
}

int EightPuzzleNode::calculateHeuristicTilesOutRowCol()
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
            int currentNumber = myPieces.at(i).at(j);
            if (goalPieces.at(i).at(j) != myPieces.at(i).at(j)) {
                tuple<int, int> goalIndices =
                    goal.indicesOfElement(currentNumber);
                if (get<0>(goalIndices) != i) {
                    score++;
                }

                if (get<1>(goalIndices) != j) {
                    score++;
                }
            }
        }
    }
    return score;
}

vector<EightPuzzleNode*> EightPuzzleNode::getSuccessors(set<EightPuzzleNode*,
    CompareBoard> closed)
{
    vector<EightPuzzleNode*> successors;
    vector<EightPuzzleMove> validMoves = board.validMoves();
    for (int i = 0; i < validMoves.size(); i++) {
        bool onClosed = false;
        EightPuzzleNode* tempNode = manager.newNode(
            this, validMoves.at(i)
        );
        if (closed.find(tempNode) != closed.end()) {
            cout << "Node on closed list: " << endl;
            tempNode->printNodeDebug();
            onClosed = true;
        }
        // if its not closed go ahead and create it
        if (!onClosed) {
            successors.push_back(
                tempNode
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

void EightPuzzleNode::printNodeDebug()
{
    string strNode = "";
    strNode += "Id: " + to_string(id) + '\n';
    strNode += "Score: " + to_string(score) + '\n';
    strNode += "Steps: " + to_string(steps) + '\n';
    strNode += toString();
    cout << strNode << endl;
}


EightPuzzleBoard EightPuzzleNode::getBoard()
{
    return board;
}
