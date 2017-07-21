using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Piper_David_Proj_P1 {
    public partial class Form1 : Form {
        public Form1() {
            InitializeComponent();
        }

        private void buttonBrowseInput_Click(object sender, EventArgs e) {
            OpenFileDialog openFileDialog = new OpenFileDialog();
            DialogResult result = openFileDialog.ShowDialog(); // Show the dialog.
            if (result == DialogResult.OK) {
                this.textBoxInput.Text = openFileDialog.FileName;
            }
        }
    }
}
