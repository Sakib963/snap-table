# 🎉 SnapTable - CSV to Table Generator

Welcome to **SnapTable**, a simple and powerful web app that allows you to easily upload CSV files, select the columns you want to view, and see the data presented in a dynamic, customizable table format. No server required—just pure frontend magic with Angular! 🚀

---

## 📑 Table of Contents

- [✨ Features](#✨-features)
- [💡 How It Works](#💡-how-it-works)
- [🎥 Demo](#🎥-demo)
- [⚡️ Installation](#⚡️-installation)
- [🖱 Usage](#🖱-usage)
- [🤝 Contributing](#🤝-contributing)
- [🙏 Acknowledgments](#🙏-acknowledgments)
- [🚀 Get Involved](#🚀-get-involved)


---

## ✨ Features

- **Easy CSV Upload**: Upload your CSV file with just a click!
- **Column Selection**: Choose which columns to display in the table.
- **Dynamic Table**: View your CSV data in a clean, responsive table format.
- **Serverless**: No need for a backend—purely frontend powered by Angular.
- **Interactive**: Reorder columns, and refresh the table without page reloads.

---

## 💡 How It Works

1. **Upload CSV**: Select your CSV file by clicking the "Upload CSV" button.
2. **Column Selection**: Choose the columns you want to display from the uploaded file.
3. **Generate Table**: Hit "Generate Table" and watch as your CSV data is transformed into a neat table.
4. **Rearrange Columns**: You can rearrange the columns to suit your preferences. Just drag and drop!
5. **Go Back**: You can always go back to modify your column selection or upload a new file.

---

## 🎥 Demo

Check out the app in action! Here’s how **SnapTable** can turn your boring CSV data into an interactive table:

![Demo Image](https://placekitten.com/600/400)

---

## ⚡️ Installation

To get started with **SnapTable**, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/snap-table.git
```
### 2. Install Dependencies
```bash
cd snap-table
npm install
```
### 3. Run the App
After the dependencies are installed, you can start the app using:
```bash
ng serve
```
Visit http://localhost:4200 to see the app in action.

### 4. Setting Up Environment

To configure environment variables, you need to create the `environment.ts` and `environment.prod.ts` files in the `src/environments` directory based on the `environment.example.ts` file.

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
```

This way, you keep your sensitive data or environment-specific configurations out of the repository while providing a template for other developers to work with.


## 🖱 Usage

Once the app is running:

- Click on **Upload CSV** to select your CSV file. 📂
- Select the columns you wish to display in the table. ✅
- Hit **Generate Table** to see the results. 📊
- Optionally, you can **reorder** the columns using the up/down buttons. 🔄
- Want to try again? **Go back** and upload a new file or adjust your column selections. 🔙

---

## 🤝 Contributing

We welcome contributions to make **SnapTable** even better! 🎉 Here's how you can help:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -am 'Add new feature'`).
4. Push your changes (`git push origin feature-name`).
5. Open a pull request to the main branch.

Feel free to open an issue if you encounter any bugs or have suggestions! 🐛

---

## 🙏 Acknowledgments

- Built with ❤️ using **Angular** and **TailwindCSS**.
- Special thanks to **OpenAI** for AI assistance in development! 🤖✨

---

## 🚀 Get Involved!

Feel free to contribute, share, or just enjoy **SnapTable**! 🌟

# Have fun with your CSV files and happy tabling! 😎
