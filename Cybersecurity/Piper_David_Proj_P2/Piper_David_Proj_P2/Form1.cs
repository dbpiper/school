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
        private char[,] _cipherMatrix;
        private const char EMPTY_FLAG = '\b'; //will mark unfilled spots in encryption with this
        private const int KEY = 4;
        public Form1() {
            InitializeComponent();
        }

        private void initCipherMatrix(string text) {
            int textLen = text.Length;
            _cipherMatrix = new char[textLen, KEY];
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

        private void buildCipherMatrixForEncryption(String text) {
            initCipherMatrix(text);
            bool goingDown = true;
            int j = 0;
            // keep incrementing the column indicator
            for (int i = 0; i < text.Length; i++) {
                //should it keep going down or go up?
                if (goingDown) {
                    if (j == KEY - 1) {
                        goingDown = false;
                    } 
                } else {
                    if (j == 0) {
                        goingDown = true;
                    }
                }
                _cipherMatrix[i, j] = text[i];
               // check the new value
               if (goingDown) {
                    j++;
                } else {
                    j--;
                }

            }
        }

        private void fillCipherMatrixWithMarkers(String text) {
            initCipherMatrix(text);
            bool goingDown = true;
            int j = 0;
            // keep incrementing the column indicator
            for (int i = 0; i < text.Length; i++) {
                //should it keep going down or go up?
                if (goingDown) {
                    if (j == KEY - 1) {
                        goingDown = false;
                    } 
                } else {
                    if (j == 0) {
                        goingDown = true;
                    }
                }
                _cipherMatrix[i, j] = EMPTY_FLAG;
               // check the new value
               if (goingDown) {
                    j++;
                } else {
                    j--;
                }

            }
        }
        
        private void replaceMarksWithCiphertext(String ciphertext) {
            int c = 0;
            for (int j = 0; j < _cipherMatrix.GetLength(1); j++) {
                for (int i = 0; i < _cipherMatrix.GetLength(0); i++) {
                    if (_cipherMatrix[i, j] == EMPTY_FLAG) {
                        _cipherMatrix[i, j] = ciphertext[c];
                        c++;
                    }
                }
            }
        }

        private String encryptText(String text) {
            StringBuilder encryptedStringBuilder = new StringBuilder();
            buildCipherMatrixForEncryption(text);

            for (int j = 0; j < _cipherMatrix.GetLength(1); j++) {
                for (int i = 0; i < _cipherMatrix.GetLength(0); i++) {
                    if (_cipherMatrix[i, j] != '\0') {
                        encryptedStringBuilder.Append(_cipherMatrix[i, j]);
                    }
                }
            }

            return encryptedStringBuilder.ToString();
        }
    
        private void readOffRailfence(StringBuilder sb) {
            bool goingDown = true;
            int j = 0;
            // keep incrementing the column indicator
            for (int i = 0; i < _cipherMatrix.GetLength(0); i++) {
                //should it keep going down or go up?
                if (goingDown) {
                    if (j == KEY - 1) {
                        goingDown = false;
                    } 
                } else {
                    if (j == 0) {
                        goingDown = true;
                    }
                }
                sb.Append(_cipherMatrix[i, j]);
               // check the new value
               if (goingDown) {
                    j++;
                } else {
                    j--;
                }

            }
        }
        private String decryptText(String text) {
            StringBuilder decryptedStringBuilder = new StringBuilder();
            fillCipherMatrixWithMarkers(text);
            replaceMarksWithCiphertext(text);
            readOffRailfence(decryptedStringBuilder);
            return decryptedStringBuilder.ToString();
        }


        private void Form1_Load(object sender, EventArgs e) {

        }
    }
}
