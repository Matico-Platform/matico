use crate::auth::AuthService;
use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::{
    dashboards::{
        CreateDashboardDTO, Dashboard, DashboardOrderBy, DashboardSearch, UpdateDashboardDTO,
    },
    map_style::{BaseMap, Layer, LayerSource, LayerStyle, MapStyle},
    styles::PolygonStyle,
};
use crate::utils::PaginationParams;
use actix_web::{delete, get, post, put, web, HttpResponse};
use log::info;
use serde_json::json;
use uuid::Uuid;

#[get("")]
pub async fn get_all_dashboards(
    db: web::Data<DbPool>,
    web::Query(search): web::Query<DashboardSearch>,
    web::Query(order): web::Query<DashboardOrderBy>,
    web::Query(page): web::Query<PaginationParams>,
) -> Result<HttpResponse, ServiceError> {
    let dashboards = Dashboard::search(db.get_ref(), order, search, Some(page))?;
    Ok(HttpResponse::Ok().json(dashboards))
}

#[post("")]
pub async fn create_dashboard(
    db: web::Data<DbPool>,
    user_token: AuthService,
    web::Json(mut new_dataset): web::Json<CreateDashboardDTO>,
) -> Result<HttpResponse, ServiceError> {
    new_dataset.owner_id = Some(user_token.user.unwrap().id);

    let dashboard = Dashboard::create(db.get_ref(), new_dataset)?;
    Ok(HttpResponse::Ok().json(dashboard))
}

#[delete("/{dashboard_id}")]
pub async fn delete_dashboard(
    db: web::Data<DbPool>,
    web::Path(dashboard_id): web::Path<Uuid>,
) -> Result<HttpResponse, ServiceError> {
    Dashboard::delete(db.get_ref(), dashboard_id)?;

    Ok(HttpResponse::Ok().json(json!({ "deleted": dashboard_id })))
}

#[put("/{dashboard_id}")]
pub async fn update_dashboard(
    db: web::Data<DbPool>,
    web::Path(dashboard_id): web::Path<Uuid>,
    web::Json(update): web::Json<UpdateDashboardDTO>,
) -> Result<HttpResponse, ServiceError> {
    let update = Dashboard::update(db.get_ref(), dashboard_id, update)?;
    Ok(HttpResponse::Ok().json(update))
}

#[get("/{dashboard_id}")]
pub async fn get_dashboard(
    db: web::Data<DbPool>,
    web::Path(dashboard_id): web::Path<Uuid>,
) -> Result<HttpResponse, ServiceError> {
    let dashboard = Dashboard::find(db.get_ref(), dashboard_id)?;
    Ok(HttpResponse::Ok().json(dashboard))
}

#[get("/default")]
pub async fn get_default() -> Result<HttpResponse, ServiceError> {
    let layer = Layer {
        source: LayerSource::Dataset(Uuid::new_v4()),
        style: LayerStyle::Polygon(PolygonStyle {
            fill: [100.0, 200.0, 100.0, 100.0],
            stroke: [100.0, 200.0, 100.0, 100.0],
            opacity: 1.0,
            stroke_width: 1.0,
        }),
        name: "Test Layer".into(),
        description: "My test layer".into(),
    };

    let ms = MapStyle {
        base_map: BaseMap::CartoDBPositron,
        layers: vec![layer],
        center: [0.0, 0.0],
        zoom: 10.0,
    };
    let user_id = Uuid::new_v4();
    let dashboard: Dashboard = CreateDashboardDTO {
        name: "Test Dash".into(),
        description: "Test description".into(),
        public: false,
        owner_id: Some(user_id),
        map_style: ms,
    }
    .into();

    Ok(HttpResponse::Ok().json(dashboard))
}
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_default);
    cfg.service(get_all_dashboards);
    cfg.service(update_dashboard);
    cfg.service(delete_dashboard);
    cfg.service(create_dashboard);
    cfg.service(get_dashboard);
}
