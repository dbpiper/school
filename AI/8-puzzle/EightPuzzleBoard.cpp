// EightPuzzleBoard.cpp

#include <iostream>

#include "EightPuzzleBoard.h"

EightPuzzleBoard::EightPuzzleBoard(vector< vector<int> > pieces) :
    pieces(pieces)
{
}

/* expects a stream with the following format
   
   0 1 2
   3 4 5
   6 7 8
*/
EightPuzzleBoard::EightPuzzleBoard(istream& input)
{
    int temp;
    const int numCols = 3;
    const int numRows = 3;
    cout << "Enter a board: " << endl;
    for (int j = 0; j < numRows; j++) {
        vector<int> row;
        for (int i = 0; i < numCols; i++) {
            input >> temp;
            row.push_back(temp);
        }
        pieces.push_back(row);
    }
} 

vector < vector<int> > EightPuzzleBoard::getPieces()
{
    return pieces;
}

string EightPuzzleBoard::toString()
{
    string strBoard = "";
    const int numRows = 3;
    const int numCols = 3;

    for (int i = 0; i < numRows; i++) {
        for(int j = 0; j < numCols - 1; j++) {
            strBoard += to_string(pieces.at(i).at(j)) + ' ';
        }
        strBoard += to_string(pieces.at(i).at(2)) + '\n';
    }
    return strBoard;
}

void EightPuzzleBoard::printBoard()
{
    string boardStr = this->toString();
    cout << boardStr;
}

vector<EightPuzzleMove> EightPuzzleBoard::validMoves()
{
   vector<EightPuzzleMove> validMoves;

   tuple<int, int> blankPiece = this->findBlankPiece();
   vector< tuple<int, int> > adjacentPieces = 
        this->findAdjacentPieces(blankPiece);
   
   for (int i = 0; i < adjacentPieces.size(); i++) {
        EightPuzzleMove 
            move{blankPiece, adjacentPieces.at(i)};
        validMoves.push_back(move);
   }

    return validMoves;
}

tuple<int, int> EightPuzzleBoard::findBlankPiece()
{
    for (int i = 0; i < pieces.size(); i++) {
        for (int j = 0; j < pieces.at(i).size(); j++) {
            if (pieces.at(i).at(j) == 0) {
                return make_tuple(i, j);
            }
        }
    }
}

vector< tuple<int, int> > EightPuzzleBoard::findAdjacentPieces
    (tuple<int, int> adjacentTo)
{
    vector< tuple<int, int> > adjacentPieces;

    // left
    if (get<1>(adjacentTo) != 0) {
        adjacentPieces.push_back(make_tuple(
            get<0>(adjacentTo), get<1>(adjacentTo) - 1
            )
        );
    }
    // right
    if (get<1>(adjacentTo) !=
        pieces.at(get<0>(adjacentTo)).size() - 1 ) {
        adjacentPieces.push_back(
            make_tuple(
                get<0>(adjacentTo), get<1>(adjacentTo) + 1
            )
        );
    }
    // above
    if (get<0>(adjacentTo) != 0) { 
        adjacentPieces.push_back(
            make_tuple(
                get<0>(adjacentTo) - 1, get<1>(adjacentTo)
            )
        );
    }
    // below
    if (get<0>(adjacentTo) != pieces.size() - 1 ) {
        adjacentPieces.push_back(
            make_tuple(
                get<0>(adjacentTo) + 1, get<1>(adjacentTo)
            )
        );
    }

    return adjacentPieces;
}

void EightPuzzleBoard::makeMove(EightPuzzleMove move)
{
    tuple<int, int> firstPiece = move.firstPieceIndices;
    tuple<int, int> secondPiece = move.secondPieceIndices;
    int temp = pieces.at(get<0>(firstPiece)).at(get<1>(firstPiece));
    // assign the firstPiece to the secondPiece
    pieces.at(get<0>(firstPiece)).at(get<1>(firstPiece)) = 
        pieces.at(get<0>(secondPiece)).at(get<1>(secondPiece));
    // assign the secondPiece to the firstPiece
    pieces.at(get<0>(secondPiece)).at(get<1>(secondPiece)) = temp;
}

bool EightPuzzleBoard::isEqualTo(EightPuzzleBoard otherBoard)
{
   return getPieces() == otherBoard.getPieces(); 
}


// finds the row and column of the number
// to be combined with goal
tuple<int, int>  EightPuzzleBoard::indicesOfElement(int number)
{
    vector< vector<int> > pieces = getPieces();
    for (int i = 0; i < pieces.size(); i++) {
        for (int j = 0; j < pieces.at(i).size(); j++) {
            if (pieces.at(i).at(j) == number) {
                return make_tuple(i, j);
            }
        }
    }
}
