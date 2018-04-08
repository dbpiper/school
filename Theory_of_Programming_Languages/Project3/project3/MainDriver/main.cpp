/*
  Simple integer arithmetic calculator according to the following BNF
  exps		--> exp | exp NEWLINE exps
  exp		--> term {addop term}
  addop		--> + | -
  term		--> factor {mulop factor}
  mulop		--> * | /
  factor	--> ( exp ) | INT
*/

/*
	Author (of currentTokenValue, exp, term, and factor): David Piper
	Description: Implements a basic recursive descent parser for the above grammar.

*/

#include <iostream>
#include <iomanip>
#include <fstream>
#include <sstream>
#include <string>
#include "tokens.h"
#include "FlexLexer.h"

using namespace std;

string toknames[] = {
"INT", "LPAREN", "RPAREN", "PLUS", "MINUS", "TIMES", "DIVIDE", "NEWLINE"
};

string tokname(int tok) {
  return tok<257 || tok>264 ? "BAD_TOKEN" : toknames[tok-257];
}

// a function I have written for convenience to make retrieving the current token value
// this improves readability rather than using yylval.ival
int currentTokenValue() {
	return yylval.ival;
}

yyFlexLexer			lexer;
YYSTYPE				yylval;

int		nextToken;	//global variable stores the token to be processed

void readNextToken( void ); //read the next token into the variable nextToken

void exps( void );	//process all expressions in the input
int  exp( void );	//returns the integer value of an expression
int term ( void );	//returns the integer value of an term
int factor( void );	//returns the integer value of an factor

//If the next token matches expectedToken, read the next token and return true
//otherwise, print an error message and return false
bool match( int expectedToken );

//print the error message
void error( string errorMsg );

//skip the rest of the line
void skipline( void );

int main(int argc, char **argv) {
	ifstream	ifs; 
	
	if (argc!=2) 
	{
		cerr << "usage: " << argv[0] << " filename" << endl;
		return 1;	
	}
	ifs.open( argv[1] );
	if( !ifs ) 
	{
		cerr << "Input file cannot be opened.\n";
        return 0;
	}
	cout << "Lexcial Analysis of the file " << argv[1] << endl;
	
	lexer.switch_streams(&ifs, NULL);

	readNextToken();

	exps();

	return 0;
}

//print the error message, and
//terminate the program
void error( string errorMsg )
{
	cout << errorMsg << endl;
	exit(1);
}

//skip the rest of the line
void skipline( void )
{
	while( nextToken != NEWLINE && nextToken != 0 )
		readNextToken();
}


//read the next token into the variable nextToken
void readNextToken( void )
{
	nextToken = lexer.yylex();
}

//If the next token is expectedToken, call readNextToken and return true,
//otherwise, print an error message and return false
bool match( int expectedToken )
{
	if ( expectedToken == nextToken )
	{
		readNextToken();
		return true;
	}
	else
		return false;
}

void exps( void )
{
	int		count = 1;
	int		value;

	do 
	{
		try {
			value = exp();
			cout << "expression " << count << " : " << value << endl;
		} catch(runtime_error e) {
			skipline();
			cout << "expression " << count << " :    wrong syntax -- " << e.what() << endl;
		}
		count ++;
	} while ( match(NEWLINE) );
}

//returns the integer value of an expression
int exp( void )
{
	int value = term(); // the integer value of the expression
	while (nextToken == PLUS || nextToken == MINUS) {
		if (nextToken == PLUS) {
			match(PLUS);
			value += term();
		}
		else { //nextToken == MINUS
			match(MINUS);
			value -= term();
		}
	}
	return value;
}


// this function handles multiplication/division of factors
int term ( void )
{
	int value = factor(); // the integer value of the term
	while (nextToken == TIMES || nextToken == DIVIDE) {
		if (nextToken == TIMES) {
			match(TIMES);
			value *= factor();
		}
		else { //nextToken == DIVIDE
			match(DIVIDE);
			value /= factor();
		}
	}
	return value;
}

// this function handles factors (parts of the language that are involved in multiplication/division)
// and performs the operations inside the parns first or simply returns the integer value
int factor( void )
{
	int value; // The integer value of the factor
	if (nextToken == LPAREN) {
		match(LPAREN);
		value = exp();
		if (nextToken == RPAREN) {
			match(RPAREN);
		}
		else {
			throw runtime_error("Error: Token RPAREN expected!");
		}
	}
	else if (nextToken == INT) {
		value = currentTokenValue();
		match(INT);
	}
	else {
		throw runtime_error("Error: Token LPAREN or INT expected!");
	}
	return value;

}
