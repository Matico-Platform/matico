use crate::db::DbPool;
use crate::models::SyncImport;
use actix::prelude::*;

use std::time::Duration;

pub struct ImportScheduler {
    pub db: DbPool,
    pub ogr_string: String,
    pub interval: Duration,
}

pub struct RunImportsMsg;

impl Message for RunImportsMsg {
    type Result = ();
}

impl Actor for ImportScheduler {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Context<Self>) {
        tracing::info!("Actor is alive");

        ctx.run_interval(self.interval, move |_act, ctx| {
            let my_addr = ctx.address();
            tracing::info!("Sending run import message");
            my_addr.do_send(RunImportsMsg {});
        });
    }
}

impl Handler<RunImportsMsg> for ImportScheduler {
    type Result = ();
    fn handle(&mut self, _msg: RunImportsMsg, ctx: &mut Context<Self>) -> Self::Result {
        let db_pool = self.db.clone();
        let ogr_string = self.ogr_string.clone();
        let execution = Box::pin(async move {
            let sync_span = tracing::info_span!("task_schedule");
            let _sync_span_guard = sync_span.enter();

            if let Ok(requests) = SyncImport::pending(&db_pool){
                tracing::info!("Got {} pending requests", requests.len());
                
                for request in requests {
                    let _sync_request_span = tracing::info_span!("running_sync");
                    match request.process(&db_pool, ogr_string.clone()).await {
                        Ok(_) => tracing::info!("Processed request {:?}", request),
                        Err(e) => tracing::info!("failed to process request {:?} with error {:?}", request, e),
                    }
                }
            }
            else{
                tracing::warn!("Failed to get sync table");
            }
            tracing::info!("All Done")
        });
        ctx.spawn(execution.into_actor(self));
    }
}
