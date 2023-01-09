use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use matico_dataservice::dataservice::{DataService, RequestFetcher};
use std::sync::mpsc;
use std::{io, thread, time::Duration};
use tui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout},
    widgets::{Block, Borders, Widget},
    Terminal,
};

fn main() -> Result<(), io::Error> {
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
