#ifndef COMPARE_SCORE_H
#define COMPARE_SCORE_H

#include "EightPuzzleNode.h"

class CompareBoardAndScore {
public:
    // is n1 < n2
    bool operator() (EightPuzzleNode* n1,
        EightPuzzleNode* n2) {
        return EightPuzzleNode::compareBoardAndScore(n1, n2);
    }
};

#endif
