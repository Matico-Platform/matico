use matico_dataservice::dataservice::{DataService, RequestFetcher};
use std::{
    fs::File,
    io::{self, BufReader, Read},
    path::PathBuf,
};

pub fn load_resource(file_path: &str) -> Result<Vec<u8>, String> {
    let mut test_file_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    test_file_path.push(format!("test_data/{}", file_path));

    let file = File::open(test_file_path).expect("Failed to find example datafile");
    let mut buffer = BufReader::new(&file);

    let mut data: Vec<u8> = vec![];
    match buffer.read_to_end(&mut data) {
        Ok(_) => Ok(data),
        Err(e) => Err(format!("Failed to read file {} : {}", file_path, e)),
    }
}

fn main() -> Result<(), io::Error> {
    let wasm = load_resource("wasm_module.wasm").expect("Failed to load wasm module");
    println!("Got resource");

    let mut dataset_service: DataService<RequestFetcher> = DataService::new();
    println!("created dataset service");
    dataset_service
        .register_plugin("wasm", &wasm)
        .expect("Should have been able to load wasm");

    // let (tx, rx) = mpsc::channel();
    //
    // let dataservice: Arc<Mutex<DataService<RequestFetcher>> = Arc::new(Mutex::new(DataService::new()));
    //
    // thread::spawn(move || {
    //     let datasetservice<RequestFetcher> : DataService<>= DataService::new();
    //     let vals = ["one", "two", "three", "four", "five"];
    //     for val in vals {
    //         tx.send(val).unwrap();
    //         thread::sleep(Duration::from_secs(1));
    //     }
    // });
    //
    // loop {
    //     match rx.try_recv() {
    //         Ok(received) => println!("received {}", received),
    //         Err(error) => println!("Got some error { }", error),
    //     }
    // }

    // enable_raw_mode()?;
    // let mut stdout = io::stdout();
    // execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    // let backend = CrosstermBackend::new(stdout);
    // let mut terminal = Terminal::new(backend)?;
    //
    // terminal.draw(|f| {
    //     let size = f.size();
    //     let block = Block::default().title("Block").borders(Borders::ALL);
    //     f.render_widget(block, size);
    // })?;
    //
    // thread::sleep(Duration::from_millis(5000));
    //
    // // restore terminal
    // disable_raw_mode()?;
    // execute!(
    //     terminal.backend_mut(),
    //     LeaveAlternateScreen,
    //     DisableMouseCapture
    // )?;
    //
    // terminal.show_cursor()?;
    Ok(())
}
