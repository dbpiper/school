#include <iostream>

#include "EightPuzzleBoard.h"

int main()
{
    EightPuzzleBoard board{cin};
    //board.printBoard();
    vector<EightPuzzleMove> validMoves = board.validMoves();
    for (int i = 0; i < validMoves.size(); i++) {
        validMoves.at(i).printMove();
        cout << endl;
    }
    board.makeMove(validMoves.at(0));
    board.printBoard();
    return 0;
}
