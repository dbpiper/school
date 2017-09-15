// EightPuzzleMove.cpp

#include "EightPuzzleMove.h"

EightPuzzleMove::EightPuzzleMove(tuple<int, int> 
    firstPieceIndices, tuple<int, int> secondPieceIndices)
{
    this->firstPieceIndices = firstPieceIndices;
    this->secondPieceIndices = secondPieceIndices;
}

string EightPuzzleMove::toString()
{
    string moveStr = "";
    
    moveStr += "((";
    moveStr += to_string(get<0>(firstPieceIndices));
    moveStr += ',';
    moveStr += to_string(get<1>(firstPieceIndices));
    moveStr += "),(";
    moveStr += to_string(get<0>(secondPieceIndices));
    moveStr += ',';
    moveStr += to_string(get<1>(secondPieceIndices));
    moveStr += "))";

    return moveStr;
}

void EightPuzzleMove::printMove()
{
    string moveStr = this->toString();
    cout << moveStr;
}
