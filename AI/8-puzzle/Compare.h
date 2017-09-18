#include "EightPuzzleNode.h"

class Compare {
public:
    // is n1 > n2
    bool operator() (EightPuzzleNode* n1, EightPuzzleNode* n2) {
        return EightPuzzleNode::comparisonFunction(n1, n2);
    }
};
