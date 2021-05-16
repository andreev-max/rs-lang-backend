const express = require('express');
const fileupload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const { PORT, MONGO_CONNECTION_URL } = require('./config');
const auth = require('./routes/auth.router');
const upload = require('./routes/upload.router');
const statistics = require('./routes/statistics.router');
const settings = require('./routes/settings.routes');

const app = express();
app.use(express.json({ extended: true }));
app.use(
	fileupload({
		useTempFiles: true
	})
);
app.use(cors());
app.use('/files', express.static(path.join(__dirname, './files')));

app.use(auth);
app.use(upload);
app.use(statistics);
app.use(settings);

async function start() {
	try {
		await mongoose.connect(MONGO_CONNECTION_URL, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		});
		app.listen(PORT, () => {
			console.log(`App is running on http://localhost:${PORT}`);
		});
	} catch (e) {
		console.log('Server error', e.message);
		process.exit(1);
	}
}

start();
