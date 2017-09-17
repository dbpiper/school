#include <iostream>
#include <cstdlib>
#include <string>

#include "EightPuzzleBoard.h"

int main(int argc, char *argv[])
{
    // check to make sure we got all the args
    if (argc == 3) {
        int seed = stoi(argv[1]);
        int moves = stoi(argv[2]);
        srand(seed);
        
        EightPuzzleBoard board{cin};
        
        for (int currentMove = 1; currentMove <= moves; currentMove++) {
            vector<EightPuzzleMove> validMoves = board.validMoves();
            int randomNumber = rand() % validMoves.size();
            EightPuzzleMove moveToMake = validMoves.at(randomNumber);
            board.makeMove(moveToMake);
        }
        cout << endl;
        board.printBoard();
    }
    return 0;
}
