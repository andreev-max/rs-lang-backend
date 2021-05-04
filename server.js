const mongoose = require('mongoose');
const { PORT, MONGO_CONNECTION_URL } = require('./config');
const app = require('./app');

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
