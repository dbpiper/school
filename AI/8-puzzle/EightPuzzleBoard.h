// EightPuzzleBoard.h
#ifndef EIGHT_PUZZLE_BOARD_H
#define EIGHT_PUZZLE_BOARD_H

#include <vector>
#include <tuple>
#include <istream>
#include <string>

#include "EightPuzzleMove.h"

using namespace std;

class EightPuzzleBoard
{
   vector< vector<int> > pieces;

public:
    static int compareBoards(EightPuzzleBoard b1,
        EightPuzzleBoard b2);
    static int compareBoards2(EightPuzzleBoard b1,
        EightPuzzleBoard b2);
    EightPuzzleBoard(vector< vector<int> > pieces);
    EightPuzzleBoard(istream& input);
    // vector of ((int, int), (int, int))
    // the two tuples are indices of pieces to swap
    // the first item in each index tuple is the row
    // the second item is the column
    /*
        Examples with board:
            0 1 2
            3 4 5
            6 7 8
        { {{0, 0}, {0, 1}}, {{0, 0}, {1, 0}} }
    */
    vector<EightPuzzleMove> validMoves();
    // returns a tuple with the row
    // and col of the blank piece
    tuple<int, int> findBlankPiece();
    // finds indices of adjacent pieces
    vector< tuple<int, int> > findAdjacentPieces(
        tuple<int, int> adjacentTo);
    // makes the move specified by swapping the two pieces
    void makeMove(EightPuzzleMove move);
    string toString();
    void printBoard();
    vector < vector<int> > getPieces(); 
    bool isEqualTo(EightPuzzleBoard otherBoard);
    tuple<int, int> indicesOfElement(int number);

};

#endif
