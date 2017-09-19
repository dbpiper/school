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

void printOpenList(auto openList);
void printClosedList(auto closedList);
void printIntersectionOfOpenAndClosed(auto openList, auto closedList);
void removeClosedFromOpen(auto* openList, auto closedList);
void printIntersectionOfSuccAndClosed(auto succ, auto closed);

int main(int argc, char *argv[])
{
    // check to make sure we got all the args
    if (argc == 2) {
        // initialization
        int heuristic = stoi(argv[1]);
        EightPuzzleNodeManager manager =
            EightPuzzleNodeManager(heuristic);
        EightPuzzleBoard startBoard{cin};        
        EightPuzzleNode* startNode = 
            manager.newNode(NULL, startBoard); 
        
        int maxNodesInMem = 0;

        // a-star data structs
        // init open list with first node
        priority_queue<EightPuzzleNode*,
            vector<EightPuzzleNode*>,
            CompareScore> open;
        //vector<EightPuzzleNode*> open;
        open.push(startNode);
        // declare closed list 
        set<EightPuzzleNode*, CompareBoard> closed;
        
        int visited = 0;
        cout << "Searching..." << endl;

        int i = 0;
        while (!open.empty()) {
            //removeClosedFromOpen(&open, closed);
            //printIntersectionOfOpenAndClosed(open, closed);
            //cout << "Closed size: " << closed.size() << endl;
            //cout << "Open size: " << open.size() << endl;
            int nodesInMem = open.size() + closed.size();
            if (nodesInMem > maxNodesInMem) {
                maxNodesInMem = nodesInMem;
            }

            EightPuzzleNode* currentNode;
            
            // don't use items from closed list
            do {
                // grab the leftmost node
                currentNode = open.top();
                //currentNode->printNodeDebug();
                //for (auto node : open) {
                    //node-> printNodeDebug();
                //}
                // we visited a new node
                visited++;
                // remove the leftmost node from the open list
                open.pop();
            } while(closed.find(currentNode) != closed.end());
            if (currentNode->isGoal()) {
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
                break;
            } else { // this isn't the goal
                // get the successors who aren't on the closed list
                //currentNode->printNodeDebug();
                
                //clock_t begin = clock();
                vector<EightPuzzleNode*> children;
                children = currentNode->getSuccessors(closed);
                //printIntersectionOfSuccAndClosed(children, closed);
                //clock_t end = clock();
                //double elapsed_secs = 
                    //double(end - begin) / CLOCKS_PER_SEC;
                //cout << "getting successors took: " ;
                //cout << to_string(elapsed_secs) << " ms";
                //cout << endl;
                // add the children to the open list
                for (int i = 0; i < children.size(); i++) {
                    auto currentChild = children.at(i);
                    auto it = closed.find(currentChild);
                    if (it ==  closed.end()) {
                        open.push(children.at(i));
                    }
                } 
                auto ret = closed.insert(currentNode);
                // found node in closed
                if (!ret.second) {
                    //cout << "Compare ret to node board " << endl;
                    //cout << 
                    
                        //EightPuzzleBoard::compareBoards2(
                            //(*(ret.first))->getBoard(),
                            //currentNode->getBoard()
                        //)
                    //<< endl;
                    //cout << "Compare node to ret board " << endl;
                    //cout <<
                   
                        //EightPuzzleBoard::compareBoards2(
                            //currentNode->getBoard(),
                            //(*(ret.first))->getBoard()
                        //)
                     //<< endl;
                    //cout << "Compare: ret to node " <<
                    //to_string(
                    //EightPuzzleNode::comparisonFunctionBoard(
                    //(*(ret.first)), currentNode)) << endl;
                    //cout << "Compare: node to ret " <<
                    //to_string(
                    //EightPuzzleNode::comparisonFunctionBoard(
                    //currentNode, (*(ret.first)))) << endl;
                   //cout << "Attempting to insert node: "
                   //<< endl;
                   //currentNode->printNodeDebug();
                    //cout << "Found node: " << endl;
                    //(*(ret.first))->printNodeDebug();
                }
            }
        }
    }
    return 0;
}

void printOpenList(auto openList)
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

void printIntersectionOfOpenAndClosed(auto openList, auto closedList)
{ 
    vector<EightPuzzleNode*> intersection;
    auto qToUse = openList;
    while (!qToUse.empty())
    {
        auto found = closedList.find(qToUse.top());
        if (found != closedList.end()) {
            intersection.push_back((*found));
        }
        qToUse.pop();
    }
    cout << "intersection: " << endl;
    for (auto node : intersection) {
        node->printNodeDebug(); 
    }
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
