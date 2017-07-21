using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Piper_David_Proj_P1 {
    public partial class Form1 : Form {
        private int _currentCipher = 1;
        private Dictionary<char, char> _cipher2Dict;

        public Form1() {
            InitializeComponent();
            initCipher2Dict();
        }

        private void initCipher2Dict() {
            this._cipher2Dict = new Dictionary<char, char>();
            this._cipher2Dict.Add('A', 'D');
            this._cipher2Dict.Add('B', 'K');
            this._cipher2Dict.Add('C', 'V');
            this._cipher2Dict.Add('D', 'Q');
            this._cipher2Dict.Add('E', 'F');
            this._cipher2Dict.Add('F', 'I');
            this._cipher2Dict.Add('G', 'B');
            this._cipher2Dict.Add('H', 'J');
            this._cipher2Dict.Add('I', 'W');
            this._cipher2Dict.Add('J', 'P');
            this._cipher2Dict.Add('K', 'E');
            this._cipher2Dict.Add('L', 'S');
            this._cipher2Dict.Add('M', 'C');
            this._cipher2Dict.Add('N', 'X');
            this._cipher2Dict.Add('O', 'H');
            this._cipher2Dict.Add('P', 'T');
            this._cipher2Dict.Add('Q', 'M');
            this._cipher2Dict.Add('R', 'Y');
            this._cipher2Dict.Add('S', 'A');
            this._cipher2Dict.Add('T', 'U');
            this._cipher2Dict.Add('U', 'O');
            this._cipher2Dict.Add('V', 'L');
            this._cipher2Dict.Add('W', 'R');
            this._cipher2Dict.Add('X', 'G');
            this._cipher2Dict.Add('Y', 'Z');
            this._cipher2Dict.Add('Z', 'N');
        } 
        private void buttonBrowseInput_Click(object sender, EventArgs e) {
            OpenFileDialog openFileDialog = new OpenFileDialog();
            DialogResult result = openFileDialog.ShowDialog(); // Show the dialog.
            if (result == DialogResult.OK) {
                this.textBoxInput.Text = openFileDialog.FileName;
            }
        } 

        private void buttonBrowseOutput_Click(object sender, EventArgs e) {
            SaveFileDialog saveFileDialog = new SaveFileDialog();
            DialogResult result = saveFileDialog.ShowDialog(); // Show the dialog.
            if (result == DialogResult.OK) {
                this.textBoxOutput.Text = saveFileDialog.FileName;
            }
        }

        private void buttonRun_Click(object sender, EventArgs e) {
            try {
                string text = File.ReadAllText(this.textBoxInput.Text);
                string output;
                if (!this.checkBoxDecrypt.Checked) {
                    output = encryptText(text);
                } else {
                    output = decryptText(text);
                }
                MessageBox.Show(output);
                File.WriteAllText(this.textBoxOutput.Text, output);
            } catch (IOException ex) {

            }
        }

        // increment the cipher starting at 1 and wrapping around after 3
        private void nextCipher() {
            if (this._currentCipher == 1) {
                this._currentCipher = 2;
            } else if (this._currentCipher == 2) {
                this._currentCipher = 3;
            } else if (this._currentCipher == 3) {
                this._currentCipher = 1;
            }
        }

        private String encryptText(String text) {
            StringBuilder encryptedStringBuilder = new StringBuilder();
            foreach (char character in text) {
                encryptedStringBuilder.Append(encryptChar(character));
                nextCipher();
            }
            this._currentCipher = 1;
            return encryptedStringBuilder.ToString();
        }
    
        private String decryptText(String text) {
            StringBuilder decryptedStringBuilder = new StringBuilder();
            foreach (char character in text) {
                decryptedStringBuilder.Append(decryptChar(character));
                nextCipher();
            }
            this._currentCipher = 1;
            return decryptedStringBuilder.ToString();
        }

        private char encryptChar(char character) {
            char workingChar = Char.ToUpper(character);
            if (workingChar < 'A' || workingChar > 'Z') {
                return workingChar; // only encrypt A-Z or a-z
            } else {
                switch (_currentCipher) {
                case 1:
                    return cipher1_encrypt(workingChar);
                    break;
                case 2:
                    return cipher2_encrypt(workingChar);
                    break;
                default: //3
                    return cipher3_encrypt(workingChar);
                    break;
                }
            }
        }

        private char decryptChar(char character) {
            switch (_currentCipher) {
            case 1:
                return cipher1_decrypt(character);
                break;
            case 2:
                return cipher2_decrypt(character);
                break;
            default: //3
                return cipher3_decrypt(character);
                break;
            }
        }

        private char leftShiftX(char character, int shiftAmount) {
            char lastChar = character;
            for (int i = 0; i < shiftAmount; i++) {
                lastChar = leftShift1(lastChar);
            }
            return lastChar;
        }

        private char leftShift1(char character) {
            char workingChar = Char.ToUpper(character);
            if (workingChar < 'A' || workingChar > 'Z') {
                return workingChar; // only encrypt A-Z or a-z
            } else {
                if (workingChar == 'A') {
                    return 'Z';
                } else {
                    return (char)(workingChar - 1);
                }
            }
        }

        private char rightShiftX(char character, int shiftAmount) {
            char lastChar = character;
            for (int i = 0; i < shiftAmount; i++) {
                lastChar = rightShift1(lastChar);
            }
            return lastChar;
        }

        private char rightShift1(char character) {
            char workingChar = Char.ToUpper(character);
            if (workingChar < 'A' || workingChar > 'Z') {
                return workingChar; // only encrypt A-Z or a-z
            } else {
                if (workingChar == 'Z') {
                    return 'A';
                } else {
                    return (char)(workingChar + 1);
                }
            }
        }

        private char cipher1_encrypt(char character) {
            return leftShiftX(character, 3);
        }

        private char cipher1_decrypt(char character) {
            return rightShiftX(character, 3);
        }

        private char cipher2_encrypt(char character) {
            char value;
            this._cipher2Dict.TryGetValue(character, out value);
            return value;
        }

        private char cipher2_decrypt(char character) {
            char key = this._cipher2Dict.FirstOrDefault(x => x.Value == character).Key;
            return key;
        }

        private char cipher3_encrypt(char character) {
            return rightShiftX(character, 5);
        }

        private char cipher3_decrypt(char character) {
            return leftShiftX(character, 5);
        }

        private void Form1_Load(object sender, EventArgs e) {

        }
    }
}
