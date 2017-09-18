#ifndef COMPARE_BOARD_H
#define COMPARE_BOARD_H

#include "EightPuzzleNode.h"

class CompareBoard {
public:
    // is n1 > n2
    bool operator() (EightPuzzleNode* n1, EightPuzzleNode* n2) {
        return EightPuzzleNode::comparisonFunctionBoard(n1, n2);
    }
};

#endif
