%option noyywrap
%option c++

%{
#include <iostream>
#include <sstream>
#include "tokens.h"

using std::string;
using std::stringstream;

int string2int( string val );

%}

ALPHA		[A-Za-z]
DIGIT		[0-9]
INT			[0-9]+
 

%%
" "				{}
\t				{}
\b				{}

"+" 			{ return PLUS; }
"-" 			{ return MINUS; }
"*" 			{ return TIMES; }
"/"				{ return DIVIDE; }
"(" 			{ return LPAREN; }
")" 			{ return RPAREN; }
\n				{ return NEWLINE; }

{INT}		 	{ yylval.ival = string2int(YYText()); return INT; }

<<EOF>>			{	yyterminate(); }
.				{	std::cout << "illegal token"; }

%%

int string2int( string val )
{
	stringstream	ss(val);
	int				retval;

	ss >> retval;

	return retval;
}

