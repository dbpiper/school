#include <iostream>
#include <cstdlib>
#include <string>
#include <algorithm>
#include <cmath>
#include <queue>
#include <ctime>
#include <set>

#include "a-star.h"

#include "CompareBoard.h"
#include "CompareScore.h"
#include "EightPuzzleNode.h"
#include "EightPuzzleNodeManager.h"

void printClosedList(auto closedList);
bool printIntersectionOfOpenAndClosed(auto openList, auto closedList);
void removeClosedFromOpen(auto* openList, auto closedList);
void printIntersectionOfSuccAndClosed(auto succ, auto closed);

bool checkIntersection = false;
bool exitOnNonEmptyIntersect = false;

EightPuzzleNode* createNode(EightPuzzleNodeManager* manager,
    vector< vector<int> > pieces) {

        EightPuzzleBoard board{pieces};
        EightPuzzleNode* node = 
            manager->newNode(NULL, board);
        return node;
}

void insertSuccessors(auto *open, auto *closed,
    EightPuzzleNode* currentNode)
{
    vector<EightPuzzleNode*> children;
    auto ret = closed->insert(currentNode);
    children = currentNode->getSuccessors(*closed);
    //printIntersectionOfSuccAndClosed(children, closed);
    // insert currentNode to closed
    // add the children to the open list
    for (auto child : children) {
            if (
                EightPuzzleNode::comparisonFunctionEqualBoard(child,currentNode)) {

            cout << "Bad successor" << endl;
        }
        open->insert(child);
        //if (
            //EightPuzzleNode::comparisonFunctionEqualBoard(intersectNode, child)) {
            //cout << endl;
            //cout << "compared equal to node" << endl;
            //cout << "This is the " << 
                //"intersect piece" << endl;
            //cout << endl;
        //}
    } 
}

void doGoal(int maxNodesInMem, int visited,
    EightPuzzleNode* currentNode)
{
    // return path
    cout << "GOAL!!" << endl;
    int N = maxNodesInMem;
    int V = visited;
    int d = countDepthOfOptimal(currentNode);
    double b = calculateBranchingFactor(N, d);      

    cout << "V=" << V << endl;
    cout << "N=" << N << endl;
    cout << "d=" << d << endl;
    cout << "b=" << b << endl;

    printStartToGoal(currentNode);
}


EightPuzzleNode* getNextNode(auto *open, int &visited)
{
    EightPuzzleNode* nextNode = NULL;
    // grab the leftmost node
    auto first = open->begin();
    if (first != open->end()) {
        nextNode = (*first);
        // remove the leftmost node from the open list
        open->erase(first);
        visited++;
    }
    return nextNode;
}

void doAStar(auto *open, auto *closed, auto intersectNode)
{
        int visited = 0;
        int maxNodesInMem = 0;
        while (!open->empty()) {
            //removeClosedFromOpen(&open, closed);
            if (checkIntersection) {
                bool nonEmptyIntersection = 
                    printIntersectionOfOpenAndClosed(*open, *closed);
                if (nonEmptyIntersection) {
                    cout << "NonEmpty intersection" << endl;
                    //auto intersect = closed.find(intersectNode);
                    //if (intersect != closed.end()) {
                        //cout << "find worked" << endl;
                        //cout << "intersect in the closed" << endl;
                    //}
                if (exitOnNonEmptyIntersect) {
                    return;
                }
                }
            }
            int nodesInMem = open->size() + closed->size();
            if (nodesInMem > maxNodesInMem) {
                maxNodesInMem = nodesInMem;
            }

            if (checkIntersection) {
                 bool nonEmptyIntersection = 
                    printIntersectionOfOpenAndClosed(
                        *open, *closed);
                if (nonEmptyIntersection) {
                    cout << "NonEmpty before 1" << endl;
                    if (exitOnNonEmptyIntersect) {
                        return;
                    }
                }
            }
            EightPuzzleNode* currentNode = 
                getNextNode(open, visited);
            closed->insert(currentNode);            
    
            if (checkIntersection) {
                bool nonEmptyIntersection = 
                    printIntersectionOfOpenAndClosed(
                        *open, *closed);
                if (nonEmptyIntersection) {
                    cout << "NonEmpty after 1" << endl;

                    EightPuzzleNode* nextNode = 
                        getNextNode(open, visited);
                    cout << "Current node" << endl;
                    currentNode->printNodeDebug();
                    cout << "Next node" << endl;
                    nextNode->printNodeDebug();
                    if (exitOnNonEmptyIntersect) {
                        return;
                    }
                }
            }
            

            //currentNode->printNodeDebug();

            if (
                EightPuzzleNode::comparisonFunctionEqualBoard(intersectNode,currentNode)) {

               cout << "the current node is intersect node" << endl; 
            }

            //if (
                //EightPuzzleNode::comparisonFunctionEqualBoard(startNode,currentNode)) {

                //cout << "Current node: " << endl;
                //currentNode->printNodeDebug();
                
                //cout << "Start node: " << endl;
                //startNode->printNodeDebug();

               //cout << "the current node is start node" << endl; 
            //}
            if (currentNode->isGoal()) {
                doGoal(maxNodesInMem, visited,
                    currentNode);
                break;
            } else { // this isn't the goal
                // get the successors who aren't on the closed list
             if (checkIntersection) {
                 bool nonEmptyIntersection = 
                    printIntersectionOfOpenAndClosed(
                        *open, *closed);
                if (nonEmptyIntersection) {
                    cout << "NonEmpty before" << endl;
                    if (exitOnNonEmptyIntersect) {
                        return;
                    }
                }
            }
            insertSuccessors(open, closed,
                currentNode); 
            
            if (checkIntersection) {
                bool nonEmptyIntersection = 
                    printIntersectionOfOpenAndClosed(
                        *open, *closed);
                if (nonEmptyIntersection) {
                    cout << "NonEmpty after" << endl;
                    currentNode->printNodeDebug();
                    if (exitOnNonEmptyIntersect) {
                        return;
                    }
                }
            }
 
            }
        }

        if (open->empty()) {
            cout << "Open empty" << endl;
        }
}

int main(int argc, char *argv[])
{
    // check to make sure we got all the args
    if (argc == 2) {
        // initialization
        int heuristic = stoi(argv[1]);
        EightPuzzleNodeManager manager =
            EightPuzzleNodeManager(heuristic);
        EightPuzzleBoard startBoard{cin};
        vector< vector<int> > intersectPieces = {
            {5, 7, 0},
            {1, 4, 2},
            {8, 6, 3}
        };
        EightPuzzleNode* intersectNode = createNode(&manager,
            intersectPieces);
        cout << "Intersect node: " << endl;
        intersectNode->printNodeDebug();

        vector< vector<int> > fakeStartPieces = {
            {5, 2, 4},
            {1, 0, 7},
            {8, 6, 3}
        };
        EightPuzzleNode* fakeStartNode = createNode(&manager, 
            fakeStartPieces);
        EightPuzzleNode* startNode = 
            manager.newNode(NULL, startBoard); 
        if (EightPuzzleNode::comparisonFunctionEqualBoard
            (startNode, fakeStartNode)) {
            cout << "start node and fake start are same"
            << endl;
        }

        // a-star data structs
        // init open list with first node
        set<EightPuzzleNode*,
            CompareScore> open;
        open.insert(startNode);
        // declare closed list 
        set<EightPuzzleNode*, CompareBoard> closed;
        
        cout << "Searching..." << endl;
        
        doAStar(&open, &closed, intersectNode);
    
        int i = 0;
    }
    return 0;
}

/*
void printOpenList(
        priority_queue<EightPuzzleNode*,
            vector<EightPuzzleNode*>,
            CompareScore> openList)
{
    cout << "Open list: " << endl;
    //auto qToUse = priority_queue<EightPuzzleNode*,
            //vector<EightPuzzleNode*>,
            //CompareScore> {openList};
    auto qToUse = openList;
    while (!qToUse.empty())
    {
        qToUse.top()->printNodeDebug();
        qToUse.pop();
    }
    cout << endl;
}
*/

void printClosedList(auto closedList)
{
    cout << "Closed list: " << endl;
    for (auto node : closedList) {
        node->printNodeDebug();
    }
    cout << endl;
}

void removeClosedFromOpen(auto* openList, auto closedList)
{
    vector<EightPuzzleNode*> nonIntersection;
    while (!openList->empty())
    {
        auto top = openList->top();
        auto found = closedList.find(top);
        openList->pop();
        if (found == closedList.end()) {
            nonIntersection.push_back(top);
        }
    }
    for (auto node : nonIntersection) {
        openList->push(node);
    }
}

void printIntersectionOfSuccAndClosed(auto succ, auto closed)
{

    vector<EightPuzzleNode*> intersection;
    for (auto child : succ)
    {
        auto found = closed.find(child);
        if (found != closed.end()) {
            intersection.push_back(child);
        }
    }
    cout << "intersection succ: " << endl;
    for (auto node : intersection) {
        node->printNodeDebug(); 
    }
}

bool printIntersectionOfOpenAndClosed(auto openList, auto closedList)
{ 
    int i = 0;
    int j = 0;
    vector<EightPuzzleNode*> intersection;
    bool intersectFound = false;

    for (auto node : closedList) {
        auto found = openList.find(node);
        if (found != openList.end()) {
            intersection.push_back((*found));
            intersectFound = true;
        }
        if (!intersectFound) {
            i++;
        }
    }
    
    intersectFound = false;
    for (EightPuzzleNode* node : openList) {
        auto found = closedList.find(node);
        if (found != closedList.end()) {
            intersectFound = true;
        }
        if (!intersectFound) {
            j++;
        }
    }

    cout << "intersection: " << endl;
    for (EightPuzzleNode* node : intersection) {
        cout << 
            "Index of intersection in closed list: " 
            << i;
        cout << endl;
        cout << 
            "Index of intersection in open list: " 
            << j;
        cout << endl;
        node->printNodeDebug(); 
    }
    cout << "Finished printing intersection" << endl;
    return intersection.size() > 0;
}

void printStartToGoal(EightPuzzleNode* endState)
{
    vector<EightPuzzleNode*> optimalPath;
    EightPuzzleNode *currentState;
    for (currentState = endState; currentState != NULL; 
        currentState = currentState->parent) {
        optimalPath.push_back(currentState);    
    
    }
    reverse(optimalPath.begin(), optimalPath.end());
    for (auto state : optimalPath) {
        state->printNode();
    }
}

int countDepthOfOptimal(EightPuzzleNode* endState)
{
    int depth = 0;
    EightPuzzleNode *currentState;
    for (currentState = endState; currentState != NULL; 
        currentState = currentState->parent) {
        depth++;
    }
    return depth;
}

double calculateBranchingFactor(int N, int d)
{
    return pow((double)N, 1.0/(double)d);
}

//bool isNodeInOpen(priority_queue<EightPuzzleNode*, vector<EightPuzzleNode*>,  Compare> open,
    //EightPuzzleNode* node)
//{
    //bool inOpen = false;
    //for (auto openNode : open) {
        //if (node->areBoardsSame((*openNode)) ) {
        //// not less so greater than or equal to
           ////&& !node->compareToNode((*openNode)))  {
            //inOpen = true;
        //}
    //}
    //return inOpen;
//}
