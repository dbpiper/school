#include <iostream>
#include <cstdlib>
#include <string>
#include <algorithm>
#include <cmath>

#include "a-star.h"

#include "EightPuzzleNodeManager.h"

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
        vector<EightPuzzleNode*> open;
        open.push_back(startNode);
        // declare closed list 
        vector<EightPuzzleNode*> closed;
        
        int visited = 0;
        cout << "Searching..." << endl;
        while (!open.empty()) {
            int nodesInMem = open.size() + closed.size();
            if (nodesInMem > maxNodesInMem) {
                maxNodesInMem = nodesInMem;
            }
            // grab the leftmost node
            EightPuzzleNode* currentNode = open.at(0);
            // we visited a new node
            visited++;
            // remove the leftmost node from the open list
            open.erase(open.begin());
            
            if (currentNode->isGoal()) {
                // return path
                cout << "GOAL!!" << endl;
                int N = maxNodesInMem;
                int V = visited;
                int d = countDepthOfOptimal(currentNode);
                int b = calculateBranchingFactor(N, d);      

                cout << "V=" << V << endl;
                cout << "N=" << N << endl;
                cout << "d=" << d << endl;
                cout << "b=" << b << endl;

                printStartToGoal(currentNode);
                break;
            } else { // this isn't the goal
                // get the successors who aren't on the closed list
                vector<EightPuzzleNode*> children =
                    currentNode->getSuccessors(closed);
                for (int i = 0; i < children.size(); i++) {
                    open.push_back(children.at(i));
                }
                closed.push_back(currentNode);
                sort(open.begin(), open.end(), EightPuzzleNode::comparisonFunction);
            }
        }
    }
    return 0;
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
    return pow(N, 1.0/d);
}
