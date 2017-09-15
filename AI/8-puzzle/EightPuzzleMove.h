// EightPuzzleMove.h

#ifndef EIGHT_PUZZLE_MOVE_H
#define EIGHT_PUZZLE_MOVE_H

#include <iostream>
#include <tuple>

using namespace std;

class EightPuzzleMove
{
public:
    tuple<int, int> firstPieceIndices;
    tuple<int, int> secondPieceIndices;
    EightPuzzleMove(tuple<int, int> firstPieceIndices, 
        tuple<int, int> secondPieceIndices);
    string toString();
    void printMove();
};

#endif

