#include <iostream>
#include <set>
#include <vector>

#include "CompareScore.h"
#include "CompareBoard.h"
#include "EightPuzzleNode.h"
#include "EightPuzzleNodeManager.h"

EightPuzzleNode* getNextNode(auto *open)
{
    auto first = open->begin();
    if (first != open->end()) {
        EightPuzzleNode* nextNode = (*first);
        open->erase(first);
        return nextNode;
    }
    return NULL;
 
}

bool testOpenSetDoesntDuplicate()
{
    set<EightPuzzleNode*, CompareScore> open;
    EightPuzzleNodeManager manager =
        EightPuzzleNodeManager(0);
    
    vector< vector<int> > board1Pieces = {
        {0, 1, 2},
        {3, 4, 5},
        {6, 7, 8}
    };
    EightPuzzleBoard board1 {board1Pieces};

    vector< vector<int> > board2Pieces = {
        {1, 0, 2},
        {3, 4, 5},
        {6, 7, 8}
    };
    EightPuzzleBoard board2 {board2Pieces};

    vector< vector<int> > board3Pieces = {
        {3, 0, 2},
        {1, 4, 5},
        {6, 7, 8}
    };
    EightPuzzleBoard board3 {board3Pieces};
    
    for (int i = 0; i < 100; i++) {
        EightPuzzleNode* node1 = manager.newNode(NULL, board1,
            i);
        EightPuzzleNode* node2 = manager.newNode(NULL, board2,
            i);
        EightPuzzleNode* node3 = manager.newNode(NULL, board3,
            i);
        open.insert(node1);
        open.insert(node2);
        open.insert(node3);
    }
    cout << "Open.size(): " << open.size() << endl;
    return open.size() == 3;
}

bool testOpenSetGetsLowest()
{
    set<EightPuzzleNode*, CompareScore> open;
    EightPuzzleNodeManager manager =
        EightPuzzleNodeManager(0);
    
    vector< vector<int> > board1Pieces = {
        {0, 1, 2},
        {3, 4, 5},
        {6, 7, 8}
    };
    EightPuzzleBoard board1 {board1Pieces};

    EightPuzzleNode* node1 = manager.newNode(NULL, board1,
        6);
    open.insert(node1);

    EightPuzzleNode* node2 = manager.newNode(NULL, board1,
        5);
    cout << "compare: " << 
        EightPuzzleNode::comparisonFunction(node1, node2) << endl;
    open.insert(node2);
 
    cout << "compare: " << 
        EightPuzzleNode::comparisonFunction(node2, node1) << endl;
    open.insert(node2);
    
    EightPuzzleNode* node3 = manager.newNode(NULL, board1,
        3);
    open.insert(node3);
    
    EightPuzzleNode* node4 = manager.newNode(NULL, board1,
        7);
    open.insert(node4);

    EightPuzzleNode* node5 = manager.newNode(NULL, board1,
        4);
    open.insert(node5);
    
    EightPuzzleNode* node6 = manager.newNode(NULL, board1,
        10);
    open.insert(node6);

    EightPuzzleNode* nextNode = getNextNode(&open);
    if (nextNode) {
        int firstScore = nextNode->getScore();
        cout << "first score: " << nextNode->getScore() << endl;
        EightPuzzleNode* nextNextNode = getNextNode(&open);
        cout << "size of open: " << open.size() << endl;
        if (nextNextNode)
        {
            cout << "second score: " << nextNextNode->getScore() << endl;
        }
        return firstScore == 3;
    }
    return false;
}

int main()
{
    bool doesntDuplicate = testOpenSetDoesntDuplicate();
    bool gotThree = testOpenSetGetsLowest();
    if (!doesntDuplicate) {
        cout << "Our open set duplicates!!" << endl;
        return 1;
    }
    if (!gotThree) {
        cout << "Our open set doesn't get the lowest!!" << endl;
        return 1;
    }
    return 0;
}

