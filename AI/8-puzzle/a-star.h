// a-star.h
// Author: David Piper
// This is the header file for
// a-star.cpp it has some
// helper functions for the main algorithm.

#ifndef A_STAR_H
#define A_STAR_H

#include "EightPuzzleNode.h"

void printStartToGoal(EightPuzzleNode* endState);
int countDepthOfOptimal(EightPuzzleNode* endState);
double calculateBranchingFactor(int N, int d);
bool isNodeInOpen(vector<EightPuzzleNode*> open,
    EightPuzzleNode* node);

#endif
