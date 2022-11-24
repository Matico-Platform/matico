(this["webpackJsonpsimple-map-viewer"] =
  this["webpackJsonpsimple-map-viewer"] || []).push([
  [0],
  {
    219: function (e, t) {},
    332: function (e, t, n) {},
    363: function (e, t) {},
    524: function (e, t, n) {},
    526: function (e, t, n) {
      "use strict";
      n.r(t);
      var a,
        r,
        o = n(0),
        c = n.n(o),
        i = n(80),
        s = n.n(i),
        l = (n(332), n(10)),
        d = l.d.div.withConfig({
          displayName: "Layout__AppLayout",
          componentId: "sc-8bupdc-0",
        })(
          [
            "width:100vw;height:100vh;background-color:",
            ";display:grid;grid-template-columns:60px 1fr;grid-template-areas:'nav main';",
          ],
          function (e) {
            return e.theme.colors.background;
          }
        ),
        u = l.d.div.withConfig({
          displayName: "Layout__FlexSeperator",
          componentId: "sc-8bupdc-1",
        })(["flex:1;"]),
        b = l.d.nav.withConfig({
          displayName: "Layout__NavArea",
          componentId: "sc-8bupdc-2",
        })(
          ["width:100%;height:100%;background-color:", ";grid-area:nav;"],
          function (e) {
            return e.theme.colors.main;
          }
        ),
        j = l.d.div.withConfig({
          displayName: "Layout__Page",
          componentId: "sc-8bupdc-3",
        })([
          "grid-area:main;display:flex;width:100%;height:100%;flex-direction:row;",
        ]),
        p = l.d.div.withConfig({
          displayName: "Layout__PageContent",
          componentId: "sc-8bupdc-4",
        })(["flex:1;width:100%;height:100vh;"]),
        h = l.d.div.withConfig({
          displayName: "Layout__DetailsArea",
          componentId: "sc-8bupdc-5",
        })(
          [
            "width:",
            ";height:100vh;color:white;padding:20px;display:flex;flex-direction:column;background-color:",
            ";",
          ],
          function (e) {
            var t = e.size;
            return void 0 === t || "small" === t ? "300px" : "400px";
          },
          function (e) {
            return e.theme.colors.secondary;
          }
        ),
        f =
          (l.d.div.withConfig({
            displayName: "Layout__MainArea",
            componentId: "sc-8bupdc-6",
          })([
            "padding:20px;width:100%;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;",
          ]),
          l.d.div.withConfig({
            displayName: "Layout__Paper",
            componentId: "sc-8bupdc-7",
          })([
            "position:relative;-webkit-box-shadow:0 1px 4px rgba(0,0,0,0.3),0 0 40px rgba(0,0,0,0.1) inset;-moz-box-shadow:0 1px 4px rgba(0,0,0,0.3),0 0 40px rgba(0,0,0,0.1) inset;box-shadow:0 1px 4px rgba(0,0,0,0.3),0 0 40px rgba(0,0,0,0.1) inset;padding:10px;border-radius:10px;background-color:white;:before,:after{content:'';position:absolute;z-index:-1;-webkit-box-shadow:0 0 20px rgba(0,0,0,0.8);-moz-box-shadow:0 0 20px rgba(0,0,0,0.8);box-shadow:0 0 20px rgba(0,0,0,0.8);top:10px;bottom:10px;left:0;right:0;-moz-border-radius:100px / 10px;border-radius:100px / 10px;}:after{right:10px;left:auto;-webkit-transform:skew(8deg) rotate(3deg);-moz-transform:skew(8deg) rotate(3deg);-ms-transform:skew(8deg) rotate(3deg);-o-transform:skew(8deg) rotate(3deg);transform:skew(8deg) rotate(3deg);}",
          ])),
        O = n(14),
        g = n(11),
        x = n(21),
        m = n.n(x),
        y = n(38),
        v = n(292),
        S = n.n(v);
      !(function (e) {
        (e.Quantiles = "quantiles"),
          (e.EqualInterval = "equal_interval"),
          (e.Scaled = "scaled"),
          (e.Custom = "custom");
      })(a || (a = {})),
        (function (e) {
          (e[(e.Linear = "linear")] = "Linear"),
            (e[(e.Sqrt = "sqrt")] = "Sqrt"),
            (e[(e.log = "log")] = "log");
        })(r || (r = {}));
      var w,
        _,
        C = [140, 170, 180, 90],
        N = [200, 200, 200, 90];
      !(function (e) {
        (e.Light = "Light"),
          (e.Dark = "Dark"),
          (e.Satelite = "Satelite"),
          (e.Terrain = "Terrain"),
          (e.Streets = "Streets"),
          (e.CartoDBPositron = "CartoDBPositron"),
          (e.CartoDBVoyager = "CartoDBVoyager"),
          (e.CartoDBDarkMatter = "CartoDBDarkMatter"),
          (e.Custom = "Custom");
      })(w || (w = {})),
        (function (e) {
          (e.pixels = "pixels"), (e.meters = "meters");
        })(_ || (_ = {}));
      var k = {
          fill: { single_color: { color: C } },
          stroke: { single_color: { color: N } },
          stroke_width: 3,
          opacity: 1,
          stroke_units: _.pixels,
          elevation: null,
        },
        D = {
          fill: { single_color: { color: C } },
          size: 20,
          stroke: { single_color: { color: N } },
          stroke_width: 3,
          opacity: 1,
          stroke_units: _.pixels,
          size_units: _.pixels,
        },
        P = {
          stroke: { single_color: { color: N } },
          stroke_width: 3,
          opacity: 1,
        },
        I = {
          center: [-74.006, 40.7128],
          zoom: 13,
          base_map: w.Light,
          layers: [],
        },
        E = S.a.create({
          baseURL: "".concat(window.location.origin, "/api"),
          headers: { "Content-Type": "application/json" },
        });
      function L() {
        return (L = Object(y.a)(
          m.a.mark(function e() {
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt("return", E.get("/users/profile"));
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function T() {
        return (T = Object(y.a)(
          m.a.mark(function e(t, n) {
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      E.post("/auth/login", { email: t, password: n })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function A() {
        return (A = Object(y.a)(
          m.a.mark(function e(t, n, a) {
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      E.post("/auth/signup", {
                        email: a,
                        password: n,
                        username: t,
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function B() {
        return (B = Object(y.a)(
          m.a.mark(function e() {
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt("return", E.get("/datasets"));
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function R() {
        return (R = Object(y.a)(
          m.a.mark(function e(t) {
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt("return", E.get("datasets/".concat(t)));
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function U() {
        return (U = Object(y.a)(
          m.a.mark(function e() {
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt("return", E.get("dashboards"));
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function M() {
        return (M = Object(y.a)(
          m.a.mark(function e(t) {
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      E.get("datasets/".concat(t, "/columns"))
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function F() {
        return (F = Object(y.a)(
          m.a.mark(function e(t) {
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt("return", E.get("dashboards/".concat(t)));
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function G() {
        return (G = Object(y.a)(
          m.a.mark(function e(t) {
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt("return", E.post("/dashboards", t));
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function z() {
        return (z = Object(y.a)(
          m.a.mark(function e(t, n) {
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      E.put("/dashboards/".concat(t), n)
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function V() {
        return (V = Object(y.a)(
          m.a.mark(function e(t, n) {
            var a;
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    if ("Dataset" !== Object.keys(t)[0]) {
                      e.next = 5;
                      break;
                    }
                    return (
                      (a = t),
                      e.abrupt(
                        "return",
                        E.get(
                          "datasets/"
                            .concat(a.Dataset, "/columns/")
                            .concat(n.name, "/stats?stat=")
                            .concat(
                              JSON.stringify({ BasicStats: { no_bins: 20 } })
                            )
                        )
                      )
                    );
                  case 5:
                    throw Error(
                      "Layer source does not implement this functionality yet"
                    );
                  case 6:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function H() {
        return (H = Object(y.a)(
          m.a.mark(function e(t, n) {
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      E.get(
                        "datasets/"
                          .concat(t, "/columns/")
                          .concat(n, "/stats?stat=")
                          .concat(JSON.stringify({ ValueCounts: {} }))
                      )
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function q() {
        return (q = Object(y.a)(
          m.a.mark(function e(t, n, a) {
            var r;
            return m.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    if ("Dataset" !== Object.keys(n)[0]) {
                      e.next = 5;
                      break;
                    }
                    return (
                      (r = n),
                      e.abrupt(
                        "return",
                        E.get(
                          "datasets/"
                            .concat(r.Dataset, "/columns/")
                            .concat(t.name, "/stats?stat=")
                            .concat(
                              JSON.stringify({ Histogram: { no_bins: 20 } })
                            )
                        )
                      )
                    );
                  case 5:
                    throw Error(
                      "Layer source does not implement this functionality yet"
                    );
                  case 6:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      E.interceptors.request.use(
        function (e) {
          var t = localStorage.getItem("token");
          return t && (e.headers.Authorization = "Bearer ".concat(t)), e;
        },
        function (e) {
          return Promise.reject(e);
        }
      );
      var W,
        Y = E,
        J = n(3);
      !(function (e) {
        (e[(e.ATTEMPT_LOGIN = 0)] = "ATTEMPT_LOGIN"),
          (e[(e.SIGNED_OUT = 1)] = "SIGNED_OUT"),
          (e[(e.SIGNED_IN = 2)] = "SIGNED_IN"),
          (e[(e.ATTEMPT_SIGNUP = 3)] = "ATTEMPT_SIGNUP"),
          (e[(e.SIGNUP_SUCCESSFUL = 4)] = "SIGNUP_SUCCESSFUL"),
          (e[(e.UPDATE_USER = 5)] = "UPDATE_USER"),
          (e[(e.SIGNUP_FAILED = 6)] = "SIGNUP_FAILED");
      })(W || (W = {}));
      var Q = {
          user: null,
          errors: [],
          attempting_signin: !1,
          attempting_signup: !1,
        },
        Z = Object(o.createContext)({
          state: Q,
          dispatch: function () {
            return null;
          },
        });
      function X(e, t) {
        switch (t.type) {
          case W.UPDATE_USER:
            return Object(g.a)(Object(g.a)({}, e), {}, { user: t.payload });
          case W.SIGNED_IN:
            return Object(g.a)(
              Object(g.a)({}, e),
              {},
              { attempting_signin: !1 }
            );
          case W.ATTEMPT_SIGNUP:
            return Object(g.a)(
              Object(g.a)({}, e),
              {},
              { attempting_signup: !0 }
            );
          case W.SIGNUP_FAILED:
            return Object(g.a)(
              Object(g.a)({}, e),
              {},
              { attempting_signup: !1, errors: [t.payload] }
            );
          case W.SIGNED_OUT:
            return Object(g.a)(Object(g.a)({}, e), {}, { user: null });
          case W.SIGNUP_SUCCESSFUL:
            return Object(g.a)(
              Object(g.a)({}, e),
              {},
              { user: t.payload, errors: [], attempting_signup: !1 }
            );
          default:
            return e;
        }
      }
      var K,
        $ = function () {
          var e = Object(o.useContext)(Z),
            t = e.state,
            n = e.dispatch;
          return Object(g.a)(
            Object(g.a)({}, t),
            {},
            {
              login: function (e, t) {
                (function (e, t) {
                  return T.apply(this, arguments);
                })(e, t).then(function (e) {
                  localStorage.setItem("token", e.data.token),
                    n({ type: W.UPDATE_USER, payload: e.data.user });
                });
              },
              signup: function (e, t, a) {
                n({ type: W.ATTEMPT_SIGNUP }),
                  (function (e, t, n) {
                    return A.apply(this, arguments);
                  })(e, t, a)
                    .then(function (e) {
                      localStorage.setItem("token", e.data.token),
                        n({ type: W.SIGNUP_SUCCESSFUL, payload: e.data.user });
                    })
                    .catch(function (e) {
                      n({ type: W.SIGNUP_FAILED, payload: e.toString() });
                    });
              },
              signout: function () {
                localStorage.removeItem("token"), n({ type: W.SIGNED_OUT });
              },
            }
          );
        },
        ee = function (e) {
          var t = e.children,
            n = Object(o.useReducer)(X, Q),
            a = Object(O.a)(n, 2),
            r = a[0],
            c = a[1];
          return (
            Object(o.useEffect)(function () {
              (function () {
                return L.apply(this, arguments);
              })()
                .then(function (e) {
                  c({ type: W.SIGNED_IN }),
                    c({ type: W.UPDATE_USER, payload: e.data });
                })
                .catch(function (e) {
                  console.warn("token is invalid or stale", e);
                });
            }, []),
            Object(J.jsx)(Z.Provider, {
              value: { state: r, dispatch: c },
              children: t,
            })
          );
        },
        te = l.d.div.withConfig({
          displayName: "Card",
          componentId: "cw71b8-0",
        })(
          [
            "background-color:",
            ";color:white;border-radius:",
            ";padding:20px;",
          ],
          function (e) {
            return e.theme.colors.secondary;
          },
          function (e) {
            return e.theme.borderRadius;
          }
        ),
        ne = n(35),
        ae = l.d.ul.withConfig({
          displayName: "TabStyles__TabHeader",
          componentId: "sc-1xunuo-0",
        })([
          "display:flex;flex-direction:row;padding:0px 10px 10px 10px;justify-content:space-around;align-items:center;",
        ]),
        re = l.d.div.withConfig({
          displayName: "TabStyles__TabContainer",
          componentId: "sc-1xunuo-1",
        })(["display:flex;flex-direction:column;flex:1;"]),
        oe = l.d.div.withConfig({
          displayName: "TabStyles__TabContent",
          componentId: "sc-1xunuo-2",
        })(["overflow-y:hidden;flex:1;display:flex;"]),
        ce = {
          TabContainer: re,
          TabHeader: ae,
          Tab: l.d.li.withConfig({
            displayName: "TabStyles__Tab",
            componentId: "sc-1xunuo-3",
          })(
            [
              "border-bottom:",
              ";color:white;cursor:pointer;background-color:",
              ";font-weight:bold;flex:1;text-align:center;padding:10px;font-size:15px;",
            ],
            function (e) {
              return e.active ? "2px solid" : "none";
            },
            function (e) {
              return e.active ? "#c38d9e" : "#eddde2";
            }
          ),
          TabContent: oe,
        },
        ie = function (e) {
          var t = e.active,
            n = e.name,
            a = e.onSelect;
          return Object(J.jsx)(ce.Tab, {
            onClick: function () {
              return a(n);
            },
            active: t,
            children: n,
          });
        },
        se = function (e) {
          var t = e.children,
            n = e.name;
          return Object(J.jsx)(ce.TabContent, { children: t }, n);
        },
        le = function (e) {
          var t = e.onTabSelected,
            n = e.activeTab,
            a = e.children,
            r = void 0;
          if (a && a.length <= 1)
            throw new Error("Need to have at least 2 tabs");
          a && (r = a[0].props.name);
          var c = Object(o.useState)(n || r),
            i = Object(O.a)(c, 2),
            s = i[0],
            l = i[1],
            d = function (e) {
              t && t(e), l(e);
            },
            u = n || s,
            b =
              null === a || void 0 === a
                ? void 0
                : a.map(function (e) {
                    return Object(J.jsx)(
                      ie,
                      {
                        onSelect: d,
                        active: e.props.name === u,
                        name: e.props.name,
                      },
                      e.props.name
                    );
                  }),
            j =
              null === a || void 0 === a
                ? void 0
                : a.find(function (e) {
                    return e.props.name === u;
                  });
          return Object(J.jsxs)(ce.TabContainer, {
            children: [Object(J.jsx)(ce.TabHeader, { children: b }), j],
          });
        };
      !(function (e) {
        (e.Primary = "primary"),
          (e.Secondary = "secondary"),
          (e.Dissabled = "dissables");
      })(K || (K = {}));
      var de,
        ue = l.d.button.withConfig({
          displayName: "Button",
          componentId: "hkmknn-0",
        })(
          [
            "font-size:15px;padding:10px 20px;font-weight:bold;color:white;cursor:pointer;border:none;background-color:",
            ";:hover{background-color:",
            ";}",
          ],
          function (e) {
            var t = e.kind,
              n = void 0 === t ? K.Primary : t,
              a = e.theme;
            switch (n) {
              case K.Primary:
                return a.colors.main;
              case K.Secondary:
                return a.colors.secondary;
              case K.Dissabled:
                return "lightgrey";
            }
          },
          function (e) {
            var t = e.kind,
              n = void 0 === t ? K.Primary : t,
              a = e.theme;
            switch (n) {
              case K.Primary:
                return a.colors.mainLighter;
              case K.Secondary:
                return a.colors.secondary;
              case K.Dissabled:
                return "lightgrey";
            }
          }
        ),
        be = l.d.form.withConfig({
          displayName: "Forms__Form",
          componentId: "sc-1yfl8v1-0",
        })([
          "display:grid;grid-template-columns:1fr 1fr;grid-row-gap:10px;grid-column-gap:10px;align-items:center;h3{grid-column:1 / span 2;text-align:center;font-weight:bold;}button{margin-top:20px;grid-column:1 / span 2;}.errorMsg{color:red;grid-column:1/ span 2;text-align:right;font-size:15px;}label{justify-self:center;}",
        ]),
        je = function () {
          var e = Object(o.useState)(""),
            t = Object(O.a)(e, 2),
            n = t[0],
            a = t[1],
            r = Object(o.useState)(""),
            c = Object(O.a)(r, 2),
            i = c[0],
            s = c[1],
            l = Object(o.useState)(""),
            d = Object(O.a)(l, 2),
            u = d[0],
            b = d[1],
            j = $(),
            p = j.user,
            h = (j.errors, j.attempting_signin, j.attempting_signup, j.login),
            f = j.signup;
          return p
            ? Object(J.jsx)(ne.c, { to: "/profile" })
            : Object(J.jsx)(te, {
                children: Object(J.jsxs)(le, {
                  children: [
                    Object(J.jsx)(se, {
                      name: "login",
                      children: Object(J.jsxs)(be, {
                        onSubmit: function (e) {
                          e.preventDefault(), h(u, i);
                        },
                        children: [
                          Object(J.jsx)("label", { children: "email" }),
                          Object(J.jsx)("input", {
                            value: u,
                            onChange: function (e) {
                              return b(e.target.value);
                            },
                            type: "text",
                            placeholder: "email",
                          }),
                          Object(J.jsx)("label", { children: "password" }),
                          Object(J.jsx)("input", {
                            value: i,
                            onChange: function (e) {
                              return s(e.target.value);
                            },
                            type: "password",
                            placeholder: "password",
                          }),
                          Object(J.jsx)(ue, {
                            kind: K.Primary,
                            type: "submit",
                            children: "Login",
                          }),
                        ],
                      }),
                    }),
                    Object(J.jsx)(se, {
                      name: "signup",
                      children: Object(J.jsxs)(be, {
                        onSubmit: function (e) {
                          e.preventDefault(), f(u, i, n);
                        },
                        children: [
                          Object(J.jsx)("label", { children: "username" }),
                          Object(J.jsx)("input", {
                            value: n,
                            onChange: function (e) {
                              return a(e.target.value);
                            },
                            type: "text",
                            placeholder: "username",
                          }),
                          Object(J.jsx)("label", { children: "email" }),
                          Object(J.jsx)("input", {
                            value: u,
                            onChange: function (e) {
                              return b(e.target.value);
                            },
                            type: "text",
                            placeholder: "email",
                          }),
                          Object(J.jsx)("label", { children: "password" }),
                          Object(J.jsx)("input", {
                            value: i,
                            onChange: function (e) {
                              return s(e.target.value);
                            },
                            type: "password",
                            placeholder: "password",
                          }),
                          Object(J.jsx)(ue, {
                            kind: K.Primary,
                            type: "submit",
                            children: "Signup",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              });
        },
        pe = {
          LoginSignupPage: Object(l.d)(p).withConfig({
            displayName: "LoginSignupPageStyles__LoginSignupPage",
            componentId: "sc-11wxzn7-0",
          })([
            "display:flex;flex-direction:column;justify-content:space-around;align-items:center;flex:1;padding:20px;",
          ]),
        },
        he = function () {
          return Object(J.jsx)(j, {
            children: Object(J.jsx)(pe.LoginSignupPage, {
              children: Object(J.jsx)(f, { children: Object(J.jsx)(je, {}) }),
            }),
          });
        },
        fe = function () {
          var e = Object(o.useState)(""),
            t = Object(O.a)(e, 2),
            n = t[0],
            a = t[1],
            r = Object(o.useState)(""),
            c = Object(O.a)(r, 2),
            i = c[0],
            s = c[1],
            l = Object(o.useState)(""),
            d = Object(O.a)(l, 2),
            u = d[0],
            b = d[1],
            j = Object(o.useState)(60),
            p = Object(O.a)(j, 2),
            h = p[0],
            f = p[1],
            g = Object(o.useState)(null),
            x = Object(O.a)(g, 2),
            m = x[0],
            y = x[1],
            v = Object(o.useState)(null),
            S = Object(O.a)(v, 2),
            w = S[0],
            _ = S[1];
          return Object(J.jsxs)(be, {
            onSubmit: function (e) {
              var t;
              e.preventDefault(),
                ((t = { name: n, url: i, description: u, refreshInterval: h }),
                E.post("/datasets", t))
                  .then(function () {
                    a(""),
                      s(""),
                      b(""),
                      f(60),
                      y("Successfully created synced dataset!");
                  })
                  .catch(function (e) {
                    _("Something went wrong :-( ".concat(e.toString()));
                  });
            },
            children: [
              Object(J.jsx)("label", { children: "Name" }),
              Object(J.jsx)("input", {
                type: "text",
                placeholder: "URL",
                value: i,
                onChange: function (e) {
                  return s(e.target.value);
                },
              }),
              Object(J.jsx)("label", { children: "URL" }),
              Object(J.jsx)("input", {
                type: "text",
                placeholder: "name",
                value: n,
                onChange: function (e) {
                  return a(e.target.value);
                },
              }),
              Object(J.jsx)("label", { children: "Description" }),
              Object(J.jsx)("input", {
                type: "text",
                placeholder: "description",
                value: u,
                onChange: function (e) {
                  return b(e.target.value);
                },
              }),
              Object(J.jsx)("label", { children: "Refresh Interval" }),
              Object(J.jsx)("input", {
                type: "number",
                placeholder: "refreshInterval",
                value: h,
                onChange: function (e) {
                  return f(parseInt(e.target.value));
                },
              }),
              Object(J.jsx)("button", {
                type: "submit",
                children: "Start syncing",
              }),
              m && Object(J.jsx)("p", { children: m }),
              w && Object(J.jsx)("p", { children: w }),
            ],
          });
        },
        Oe = {
          ProgressBarOuter: l.d.div.withConfig({
            displayName: "ProgressBarStyles__ProgressBarOuter",
            componentId: "sc-1dnr14a-0",
          })([
            "width:100%;flex:1;height:20px;padding:5px;display:flex;border:1px solid grey;border-radius:10px;",
          ]),
          ProgressBarInner: l.d.div.withConfig({
            displayName: "ProgressBarStyles__ProgressBarInner",
            componentId: "sc-1dnr14a-1",
          })(["width:", ";height:15px;background-color:blue;"], function (e) {
            var t = e.percent;
            return "".concat(t, "%");
          }),
          Percent: l.d.span.withConfig({
            displayName: "ProgressBarStyles__Percent",
            componentId: "sc-1dnr14a-2",
          })([""]),
        },
        ge = function (e) {
          var t = e.showPC,
            n = e.progress;
          e.progressColor, e.doneColor, e.errorColor;
          return Object(J.jsxs)(Oe.ProgressBarOuter, {
            children: [
              Object(J.jsx)(Oe.ProgressBarInner, { percent: n }),
              t &&
                Object(J.jsxs)(Oe.Percent, {
                  children: [n.toPrecision(2), "%"],
                }),
            ],
          });
        },
        xe = {
          UploaderOuter: l.d.div.withConfig({
            displayName: "UploaderStyles__UploaderOuter",
            componentId: "wcm4m0-0",
          })([""]),
          UploaderFilename: l.d.div.withConfig({
            displayName: "UploaderStyles__UploaderFilename",
            componentId: "wcm4m0-1",
          })([""]),
        };
      !(function (e) {
        (e[(e.PENDING = 0)] = "PENDING"),
          (e[(e.IN_PROGRESS = 1)] = "IN_PROGRESS"),
          (e[(e.DONE = 2)] = "DONE"),
          (e[(e.FAILED = 3)] = "FAILED");
      })(de || (de = {}));
      var me = function (e) {
          var t = e.file,
            n = e.url,
            a = e.metadata,
            r = (e.onDone, e.onFail, Object(o.useState)(0)),
            c = Object(O.a)(r, 2),
            i = c[0],
            s = c[1],
            l = Object(o.useState)(null),
            d = Object(O.a)(l, 2),
            u = (d[0], d[1]),
            b = Object(o.useState)(de.PENDING),
            j = Object(O.a)(b, 2),
            p = (j[0], j[1]);
          return (
            Object(o.useEffect)(function () {
              (function (e, t, n, a) {
                var r = new FormData();
                return (
                  console.log("metadata is ", n),
                  r.append("metadata", JSON.stringify(n)),
                  r.append("file", e),
                  E.post(t, r, {
                    headers: { Content_Type: "multipart/form-data" },
                    onUploadProgress: function (e) {
                      a && a(Math.round((100 * e.loaded) / e.total));
                    },
                  })
                );
              })(t, n, a, s)
                .then(function () {
                  return p(de.DONE);
                })
                .catch(function (e) {
                  u(e), p(de.FAILED);
                });
            }, []),
            Object(J.jsxs)(xe.UploaderOuter, {
              children: [
                Object(J.jsx)(xe.UploaderFilename, { children: t.name }),
                Object(J.jsx)(ge, { progress: i, showPC: !0 }),
              ],
            })
          );
        },
        ye = function (e) {
          var t = e.file,
            n = e.onDone,
            a = Object(o.useState)(t.name.split(".")[0]),
            r = Object(O.a)(a, 2),
            c = r[0],
            i = r[1],
            s = Object(o.useState)(""),
            l = Object(O.a)(s, 2),
            d = l[0],
            u = l[1],
            b = Object(o.useState)("ogc_fid"),
            j = Object(O.a)(b, 2),
            p = j[0],
            h = j[1],
            f = Object(o.useState)("wkb_geometry"),
            g = Object(O.a)(f, 2),
            x = g[0],
            m = g[1],
            y = Object(o.useState)(!1),
            v = Object(O.a)(y, 2),
            S = v[0],
            w = v[1],
            _ = { name: c, description: d, id_col: p, geom_col: x };
          return Object(J.jsx)("div", {
            children: S
              ? Object(J.jsx)(me, {
                  url: "/datasets",
                  file: t,
                  metadata: _,
                  onDone: n,
                })
              : Object(J.jsxs)(be, {
                  children: [
                    Object(J.jsx)("h3", { children: t.name }),
                    Object(J.jsx)("label", { children: "name" }),
                    Object(J.jsx)("input", {
                      type: "text",
                      value: c,
                      onChange: function (e) {
                        return i(e.target.value);
                      },
                      placeholder: "Name",
                    }),
                    Object(J.jsx)("label", { children: "Description" }),
                    Object(J.jsx)("input", {
                      type: "textarea",
                      value: d,
                      onChange: function (e) {
                        return u(e.target.value);
                      },
                      placeholder: "Description",
                    }),
                    Object(J.jsx)("label", { children: "Id Column" }),
                    Object(J.jsx)("input", {
                      type: "textarea",
                      value: p,
                      onChange: function (e) {
                        return h(e.target.value);
                      },
                      placeholder: "Id column",
                    }),
                    Object(J.jsx)("label", { children: "Geom Column" }),
                    Object(J.jsx)("input", {
                      type: "textarea",
                      value: x,
                      onChange: function (e) {
                        return m(e.target.value);
                      },
                      placeholder: "Description",
                    }),
                    Object(J.jsx)("label", { children: "Size" }),
                    Object(J.jsxs)("p", {
                      children: [(1e-6 * t.size).toPrecision(2), " Mb"],
                    }),
                    Object(J.jsx)("button", {
                      onClick: function () {
                        w(!0);
                      },
                      type: "submit",
                      children: "Upload",
                    }),
                  ],
                }),
          });
        },
        ve = function (e) {
          var t = e.onDone,
            n = Object(o.useState)(null),
            a = Object(O.a)(n, 2),
            r = a[0],
            c = a[1];
          return Object(J.jsxs)("div", {
            children: [
              r &&
                Object(J.jsx)("ul", {
                  children: Array.from(r).map(function (e, n) {
                    return Object(J.jsx)(ye, { onDone: t, file: e }, n);
                  }),
                }),
              Object(J.jsx)("input", {
                onChange: function (e) {
                  console.log(e.target.files), c(e.target.files);
                },
                type: "file",
                multiple: !0,
                name: "file",
              }),
            ],
          });
        },
        Se = function (e) {
          var t = e.onCreated;
          return Object(J.jsx)(te, {
            children: Object(J.jsxs)(le, {
              children: [
                Object(J.jsx)(se, {
                  name: "Upload Files",
                  children: Object(J.jsx)(ve, { onDone: t }),
                }),
                Object(J.jsx)(se, {
                  name: "Link Url",
                  children: Object(J.jsx)(fe, {}),
                }),
              ],
            }),
          });
        },
        we = {
          ListOuter: Object(l.d)(f).withConfig({
            displayName: "ListStyles__ListOuter",
            componentId: "sc-188mwd4-0",
          })(["width:100%;"]),
          List: l.d.ul.withConfig({
            displayName: "ListStyles__List",
            componentId: "sc-188mwd4-1",
          })([""]),
          Row: l.d.li.withConfig({
            displayName: "ListStyles__Row",
            componentId: "sc-188mwd4-2",
          })([
            "border-bottom:1px solid lightgrey;display:flex;flex-direction:row;justify-content:space-between;padding:20px;color:grey;a{margin-right:10px;}:last-child{border:none;}",
          ]),
        },
        _e = we.Row,
        Ce = function (e) {
          var t = e.children;
          return e.loading
            ? Object(J.jsx)("h2", { children: "Loading" })
            : Object(J.jsx)(we.ListOuter, {
                children: Object(J.jsx)(we.List, { children: t }),
              });
        },
        Ne = n(58),
        ke = function (e) {
          var t = e.datasets,
            n = e.loading;
          return Object(J.jsx)(Ce, {
            loading: n,
            children: t.map(function (e) {
              return Object(J.jsxs)(
                _e,
                {
                  children: [
                    Object(J.jsxs)("div", {
                      children: [
                        Object(J.jsx)("h3", { children: e.name }),
                        Object(J.jsx)("p", { children: e.description }),
                      ],
                    }),
                    Object(J.jsxs)("div", {
                      children: [
                        Object(J.jsx)(Ne.Link, {
                          to: "/datasets/".concat(e.id),
                          children: Object(J.jsx)(ue, {
                            kind: K.Secondary,
                            children: "view",
                          }),
                        }),
                        Object(J.jsx)(Ne.Link, {
                          to: "/datasets/".concat(e.id),
                          children: Object(J.jsx)(ue, {
                            kind: K.Primary,
                            children: "delete",
                          }),
                        }),
                      ],
                    }),
                  ],
                },
                e.name
              );
            }),
          });
        },
        De = {
          DatasetsPage: Object(l.d)(p).withConfig({
            displayName: "DatasetsPageStyles__DatasetsPage",
            componentId: "sc-1vwhe3s-0",
          })([
            "display:flex;flex-direction:column;justify-content:space-around;align-items:center;flex:1;padding:20px;",
          ]),
        },
        Pe = function () {
          var e = Object(o.useState)([]),
            t = Object(O.a)(e, 2),
            n = t[0],
            a = t[1],
            r = Object(o.useState)(!1),
            c = Object(O.a)(r, 2),
            i = c[0],
            s = c[1],
            l = Object(o.useState)(null),
            d = Object(O.a)(l, 2),
            u = d[0],
            b = d[1],
            j = function () {
              s(!0),
                console.log("refreshing in hook "),
                (function () {
                  return B.apply(this, arguments);
                })()
                  .then(function (e) {
                    a(e.data);
                  })
                  .catch(function (e) {
                    b(e.toString());
                  })
                  .finally(function () {
                    s(!1);
                  });
            };
          return (
            Object(o.useEffect)(function () {
              return j();
            }, []),
            { datasets: n, error: u, loading: i, refreshDatasets: j }
          );
        },
        Ie = function () {
          var e = Pe(),
            t = e.datasets,
            n = e.loading,
            a = e.refreshDatasets;
          return Object(J.jsxs)(j, {
            children: [
              Object(J.jsxs)(h, {
                children: [
                  Object(J.jsx)("h1", { children: "Datasets" }),
                  Object(J.jsx)(u, {}),
                  Object(J.jsx)(ue, {
                    kind: K.Primary,
                    children: "Add Datasets",
                  }),
                ],
              }),
              Object(J.jsxs)(De.DatasetsPage, {
                children: [
                  Object(J.jsx)(ke, { datasets: t, loading: n }),
                  Object(J.jsx)(Se, {
                    onCreated: function () {
                      return a();
                    },
                  }),
                ],
              }),
            ],
          });
        },
        Ee = function (e) {
          var t = e.dashboards,
            n = e.loading,
            a = e.onDelete;
          return Object(J.jsx)(Ce, {
            loading: n,
            children: t.map(function (e) {
              return Object(J.jsxs)(
                _e,
                {
                  children: [
                    Object(J.jsxs)("div", {
                      children: [
                        Object(J.jsx)("h3", { children: e.name }),
                        Object(J.jsx)("p", { children: e.description }),
                      ],
                    }),
                    Object(J.jsxs)("div", {
                      children: [
                        Object(J.jsx)(Ne.Link, {
                          to: "/dashboard/".concat(e.id),
                          children: Object(J.jsx)(ue, {
                            kind: K.Secondary,
                            children: "view",
                          }),
                        }),
                        a &&
                          Object(J.jsx)(ue, {
                            onClick: function () {
                              return (t = e.id), void (a && a(t));
                              var t;
                            },
                            kind: K.Primary,
                            children: "delete",
                          }),
                      ],
                    }),
                  ],
                },
                e.name
              );
            }),
          });
        },
        Le = {
          DashboardsPage: Object(l.d)(p).withConfig({
            displayName: "DashboardsPageStyles__DashboardsPage",
            componentId: "sc-1ufbvus-0",
          })([
            "display:flex;flex-direction:column;justify-content:space-around;align-items:center;flex:1;padding:20px;",
          ]),
        },
        Te = n(178),
        Ae = function (e) {
          var t = e.onCreated,
            n = Object(Te.a)(),
            a = n.register,
            r = n.handleSubmit,
            o = n.errors;
          return Object(J.jsx)(f, {
            children: Object(J.jsxs)(be, {
              onSubmit: r(function (e) {
                (e.map_style = I),
                  console.log(e),
                  (function (e) {
                    return G.apply(this, arguments);
                  })(e)
                    .then(function (e) {
                      t && (console.log("running on created"), t()),
                        console.log("Gor dashboard ", e.data);
                    })
                    .catch(function (e) {
                      console.log("Failed to create dashboard ", e);
                    });
              }),
              children: [
                Object(J.jsx)("label", { children: "Name" }),
                Object(J.jsx)("input", {
                  type: "text",
                  name: "name",
                  placeholder: "name",
                  ref: a({ required: !0 }),
                }),
                o.name &&
                  "required" === o.name.type &&
                  Object(J.jsx)("p", {
                    className: "errorMsg",
                    children: "Name is required.",
                  }),
                Object(J.jsx)("label", { children: "Description" }),
                Object(J.jsx)("input", {
                  type: "text",
                  name: "description",
                  placeholder: "dashboard description",
                  ref: a({ required: !0, minLength: 6 }),
                }),
                o.description &&
                  "required" === o.description.type &&
                  Object(J.jsx)("p", {
                    className: "errorMsg",
                    children: "Description is required.",
                  }),
                o.description &&
                  "minLength" === o.description.type &&
                  Object(J.jsx)("p", {
                    className: "errorMsg",
                    children: "Description should be longer.",
                  }),
                Object(J.jsx)("label", { children: "Public" }),
                Object(J.jsx)("input", {
                  type: "checkbox",
                  name: "public",
                  placeholder: "dashboard description",
                  ref: a,
                }),
                Object(J.jsx)(ue, {
                  type: "submit",
                  kind: K.Primary,
                  children: "Create",
                }),
              ],
            }),
          });
        };
      function Be() {
        var e = Object(o.useState)(!1),
          t = Object(O.a)(e, 2),
          n = t[0],
          a = t[1],
          r = Object(o.useState)([]),
          c = Object(O.a)(r, 2),
          i = c[0],
          s = c[1],
          l = Object(o.useState)(null),
          d = Object(O.a)(l, 2),
          u = d[0],
          b = d[1],
          j = function () {
            a(!0),
              (function () {
                return U.apply(this, arguments);
              })()
                .then(function (e) {
                  s(e.data);
                })
                .catch(function (e) {
                  return b(e.toString());
                })
                .finally(function () {
                  return a(!1);
                });
          };
        return (
          Object(o.useEffect)(function () {
            return j();
          }, []),
          {
            loading: n,
            dashboards: i,
            error: u,
            refreshDashboards: j,
            deleteDashboard: function (e) {
              (function (e) {
                return E.delete("/dashboards/".concat(e));
              })(e)
                .then(function () {
                  j();
                })
                .catch(function (e) {
                  return b(e.toString());
                });
            },
          }
        );
      }
      var Re,
        Ue = function () {
          var e = Be(),
            t = e.dashboards,
            n = e.loading,
            a = e.refreshDashboards,
            r = e.deleteDashboard;
          return Object(J.jsxs)(j, {
            children: [
              Object(J.jsxs)(h, {
                children: [
                  Object(J.jsx)("h1", { children: "Dashboards" }),
                  Object(J.jsx)(u, {}),
                ],
              }),
              Object(J.jsxs)(Le.DashboardsPage, {
                children: [
                  Object(J.jsx)(Ee, {
                    onDelete: function (e) {
                      return r(e);
                    },
                    dashboards: t,
                    loading: n,
                  }),
                  Object(J.jsx)(Ae, {
                    onCreated: function () {
                      return a();
                    },
                  }),
                ],
              }),
            ],
          });
        },
        Me = function (e) {
          var t = Object(o.useState)(null),
            n = Object(O.a)(t, 2),
            a = n[0],
            r = n[1],
            c = Object(o.useState)(null),
            i = Object(O.a)(c, 2),
            s = i[0],
            l = i[1],
            d = Object(o.useState)(!1),
            u = Object(O.a)(d, 2),
            b = u[0],
            j = u[1];
          return (
            Object(o.useEffect)(
              function () {
                j(!0),
                  (function (e) {
                    return R.apply(this, arguments);
                  })(e)
                    .then(function (e) {
                      return r(e.data);
                    })
                    .catch(function (e) {
                      return l(e.toString());
                    })
                    .finally(function () {
                      return j(!1);
                    });
              },
              [e]
            ),
            { dataset: a, error: s, loading: b }
          );
        };
      !(function (e) {
        (e.ASSCENDING = "asc"), (e.DESCENDING = "desc");
      })(Re || (Re = {}));
      var Fe,
        Ge = function (e, t) {
          var n = Object(o.useState)(0),
            a = Object(O.a)(n, 2),
            r = a[0],
            c = a[1],
            i = Object(o.useState)(null),
            s = Object(O.a)(i, 2),
            l = s[0],
            d = s[1],
            u = Object(o.useState)(null),
            b = Object(O.a)(u, 2),
            j = b[0],
            p = b[1],
            h = Object(o.useState)(null),
            f = Object(O.a)(h, 2),
            g = f[0],
            x = f[1],
            m = Object(o.useState)(null),
            y = Object(O.a)(m, 2),
            v = y[0],
            S = y[1],
            w = Object(o.useState)(!1),
            _ = Object(O.a)(w, 2),
            C = _[0],
            N = _[1],
            k = Object(o.useState)(null),
            D = Object(O.a)(k, 2),
            P = D[0],
            I = (D[1], Object(o.useState)(null)),
            E = Object(O.a)(I, 2),
            L = E[0],
            T = E[1],
            A = (null === t || void 0 === t ? void 0 : t.perPage)
              ? t.perPage
              : 40;
          return (
            Object(o.useEffect)(
              function () {
                console.log(e, t, r, l, j),
                  N(!0),
                  Y.get(
                    (function (e, t, n, a, r) {
                      var o = "";
                      e.datasetId
                        ? (o = "datasets/".concat(e.datasetId, "/data"))
                        : e.sql && (o = "queries/run");
                      var c = new URLSearchParams();
                      return (
                        r &&
                          (c.append("sort", "".concat(r)),
                          c.append("sort", "".concat(a || Re.DESCENDING))),
                        c.append("limit", "".concat(n)),
                        c.append("offset", "".concat(t * n)),
                        e.sql && c.append("q", e.sql),
                        "".concat(o, "?").concat(c.toString())
                      );
                    })(e, r || 1, A, j || Re.ASSCENDING, l)
                  ).then(function (e) {
                    x(e.data.data),
                      S(e.data.metadata.total),
                      T(Math.ceil(e.data.metadata.total / A)),
                      N(!1);
                  });
              },
              [JSON.stringify(e), r, A]
            ),
            {
              data: g,
              error: P,
              loading: C,
              total: v,
              page: r,
              pages: L,
              setPage: c,
              sortCol: l,
              setSortCol: d,
              sortDirection: j,
              setSortDirection: p,
            }
          );
        },
        ze = l.d.div.withConfig({
          displayName: "DatasetViewPageStyles__Content",
          componentId: "sc-1sup1cu-0",
        })([
          "display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 400px;grid-row-gap:20px;grid-column-gap:20px;grid-template-areas:'table map' 'details details';flex-direction:row;width:100%;height:100%;padding:20px;",
        ]),
        Ve = Object(l.d)(f).withConfig({
          displayName: "DatasetViewPageStyles__Map",
          componentId: "sc-1sup1cu-1",
        })(["position:relative;grid-area:map;"]),
        He = l.d.div.withConfig({
          displayName: "DatasetViewPageStyles__TablePagination",
          componentId: "sc-1sup1cu-2",
        })([
          "width:100%;background-color:#ffffff;position:absolute;bottom:0px;left:0px;padding:20px;",
        ]),
        qe = {
          Content: ze,
          Map: Ve,
          Table: Object(l.d)(f).withConfig({
            displayName: "DatasetViewPageStyles__Table",
            componentId: "sc-1sup1cu-3",
          })([
            "max-width:100%;max-height:100%;min-width:0px;min-height:0px;grid-area:table;position:relative;div{position:absolute;bottom:0px;left:0px;width:100%;background-color:white;}",
          ]),
          Details: Object(l.d)(f).withConfig({
            displayName: "DatasetViewPageStyles__Details",
            componentId: "sc-1sup1cu-4",
          })(["grid-area:details;display:flex;"]),
          TablePagination: He,
        },
        We = n(555),
        Ye = n(554),
        Je = n(174),
        Qe = n(297),
        Ze = l.d.div.withConfig({
          displayName: "DataTableStyles__DataTable",
          componentId: "pn1fb7-0",
        })(["height:100%;width:100%;overflow:auto;position:relative;"]),
        Xe = l.d.tr.withConfig({
          displayName: "DataTableStyles__TableRow",
          componentId: "pn1fb7-1",
        })(
          [
            "cursor:pointer;:hover{background-color:",
            ";}background-color:",
            ";height:20px;",
          ],
          function (e) {
            return e.selected ? e.theme.colors.secondaryLight : "lightgrey";
          },
          function (e) {
            return e.selected ? e.theme.colors.secondaryLight : "inherit";
          }
        ),
        Ke = {
          Table: l.d.table.withConfig({
            displayName: "DataTableStyles__Table",
            componentId: "pn1fb7-2",
          })(
            [
              "background-color:white;border-collapse:collapse;table-layout:fixed;text-align:left;position:relative;th{background-color:",
              ";color:white;font-weight:bold;font-size:15px;position:sticky;top:0;box-shadow:0 2px 2px -1px rgba(0,0,0,0.4);padding:10px 20px;border-right:2px solid white;}td{padding:10px 20px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13px;max-width:200px;height:20px;}tbody{}",
            ],
            function (e) {
              return e.theme.colors.main;
            }
          ),
          TableRow: Xe,
          DataTable: Ze,
        },
        $e = function (e) {
          var t = e.data,
            n = e.onSelect,
            a = e.selectedID,
            r = e.idCol,
            c = function (e) {
              if (!e.value) return "Nan";
              switch (typeof e.value) {
                case "undefined":
                  return "NAN";
                case "object":
                  return e.value.type;
                default:
                  return e.value;
              }
              return "data";
            },
            i = Object(o.useMemo)(
              function () {
                return t.length > 0
                  ? Object.keys(t[0]).map(function (e) {
                      return { Header: e, accessor: e, Cell: c };
                    })
                  : [];
              },
              [t]
            ),
            s = Object(Qe.useTable)({ columns: i, data: t }),
            l = s.getTableProps,
            d = s.getTableBodyProps,
            u = s.headerGroups,
            b = s.rows,
            j = s.prepareRow;
          return Object(J.jsx)(Ke.DataTable, {
            children:
              t.length > 0
                ? Object(J.jsxs)(
                    Ke.Table,
                    Object(g.a)(
                      Object(g.a)({}, l()),
                      {},
                      {
                        children: [
                          Object(J.jsx)("thead", {
                            children: u.map(function (e) {
                              return Object(J.jsx)(
                                "tr",
                                Object(g.a)(
                                  Object(g.a)({}, e.getHeaderGroupProps()),
                                  {},
                                  {
                                    children: e.headers.map(function (e) {
                                      return Object(J.jsx)(
                                        "th",
                                        Object(g.a)(
                                          Object(g.a)({}, e.getHeaderProps()),
                                          {},
                                          { children: e.render("Header") }
                                        )
                                      );
                                    }),
                                  }
                                )
                              );
                            }),
                          }),
                          Object(J.jsx)(
                            "tbody",
                            Object(g.a)(
                              Object(g.a)({}, d()),
                              {},
                              {
                                children: b.map(function (e) {
                                  return (
                                    j(e),
                                    Object(J.jsx)(
                                      Ke.TableRow,
                                      Object(g.a)(
                                        Object(g.a)(
                                          {
                                            selected: e.original[r] === a,
                                            onClick: function () {
                                              return (function (e) {
                                                n && n(e.values);
                                              })(e);
                                            },
                                          },
                                          e.getRowProps()
                                        ),
                                        {},
                                        {
                                          children: e.cells.map(function (e) {
                                            return Object(J.jsx)(
                                              "td",
                                              Object(g.a)(
                                                Object(g.a)(
                                                  {},
                                                  e.getCellProps()
                                                ),
                                                {},
                                                { children: e.render("Cell") }
                                              )
                                            );
                                          }),
                                        }
                                      )
                                    )
                                  );
                                }),
                              }
                            )
                          ),
                        ],
                      }
                    )
                  )
                : Object(J.jsx)("h1", { children: "No Data" }),
          });
        },
        et = n(165),
        tt = n.n(et),
        nt =
          (n(361),
          n(241),
          {
            QueryPane: l.d.div.withConfig({
              displayName: "QueryPaneStyles__QueryPane",
              componentId: "sc-1wdurd2-0",
            })(["flex:1;display:flex;flex-direction:column;"]),
            Buttons: l.d.div.withConfig({
              displayName: "QueryPaneStyles__Buttons",
              componentId: "sc-1wdurd2-1",
            })([
              "display:flex;justify-content:flex-end;padding:10px 0px;> *{margin-left:10px;}",
            ]),
            ButtonsAndErrors: l.d.div.withConfig({
              displayName: "QueryPaneStyles__ButtonsAndErrors",
              componentId: "sc-1wdurd2-2",
            })([
              "display:flex;justify-content:space-between;align-items:center;",
            ]),
            Error: l.d.p.withConfig({
              displayName: "QueryPaneStyles__Error",
              componentId: "sc-1wdurd2-3",
            })(["color:red;"]),
          }),
        at = function (e) {
          var t = e.onQuery,
            n = e.table,
            a = e.error,
            r = Object(o.useState)(null),
            c = Object(O.a)(r, 2),
            i = c[0],
            s = c[1],
            l = "select * from ".concat(n);
          return Object(J.jsxs)(nt.QueryPane, {
            children: [
              Object(J.jsx)(tt.a, {
                defaultValue: l,
                mode: "postgressql",
                theme: "dracula",
                onChange: s,
                name: "sql",
                fontSize: "25px",
                style: { width: "100%", flex: 1 },
                editorProps: { $blockScrolling: !0 },
              }),
              Object(J.jsxs)(nt.ButtonsAndErrors, {
                children: [
                  Object(J.jsx)(nt.Error, { children: a || "" }),
                  Object(J.jsxs)(nt.Buttons, {
                    children: [
                      Object(J.jsx)(ue, {
                        onClick: function () {
                          t(null);
                        },
                        kind: K.Secondary,
                        children: "Clear",
                      }),
                      Object(J.jsx)(ue, {
                        onClick: function () {
                          t(i);
                        },
                        kind: K.Primary,
                        children: "Run",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          });
        },
        rt = n(64),
        ot = Object(l.d)(be).withConfig({
          displayName: "FeatureEditorStyles__FeatureEditor",
          componentId: "sc-15y3ygh-0",
        })(["overflow-y:auto;flex:1;"]),
        ct = {
          FormEntry: l.d.div.withConfig({
            displayName: "FeatureEditorStyles__FormEntry",
            componentId: "sc-15y3ygh-1",
          })([
            "display:grid;grid-template-columns:1fr 1fr;align-items:center;",
          ]),
          Buttons: l.d.div.withConfig({
            displayName: "FeatureEditorStyles__Buttons",
            componentId: "sc-15y3ygh-2",
          })([
            "grid-column:2;display:flex;flex-direction:row;justify-content:flex-end;button{margin-left:10px;}",
          ]),
          FeatureEditor: ot,
        },
        it = function (e) {
          var t = e.feature,
            n = e.editable,
            a = void 0 !== n && n,
            r = e.onSave,
            c = Object(o.useState)(null),
            i = Object(O.a)(c, 2),
            s = i[0],
            l = i[1];
          Object(o.useEffect)(
            function () {
              l(t);
            },
            [t]
          );
          var d = JSON.stringify(s) !== JSON.stringify(t);
          return t
            ? Object(J.jsxs)(ct.FeatureEditor, {
                children: [
                  Object.entries(s || t).map(function (e) {
                    var t,
                      n = Object(O.a)(e, 2),
                      r = n[0],
                      o = n[1];
                    return Object(J.jsxs)(
                      ct.FormEntry,
                      {
                        children: [
                          Object(J.jsx)("label", { children: r }),
                          a
                            ? Object(J.jsx)("input", {
                                type: "text",
                                onChange:
                                  ((t = r),
                                  function (e) {
                                    var n = e.target.value;
                                    l(
                                      Object(g.a)(
                                        Object(g.a)({}, s),
                                        {},
                                        Object(rt.a)({}, t, n)
                                      )
                                    );
                                  }),
                                value: o,
                              })
                            : Object(J.jsx)("p", { children: "value" }),
                        ],
                      },
                      r
                    );
                  }),
                  d &&
                    Object(J.jsxs)(ct.Buttons, {
                      children: [
                        Object(J.jsx)(ue, {
                          type: "submit",
                          onClick: function e() {
                            r && r(e);
                          },
                          children: "Save",
                        }),
                        Object(J.jsx)(ue, {
                          onClick: function () {
                            l(Object(g.a)({}, t));
                          },
                          kind: K.Secondary,
                          type: "submit",
                          children: "Discard",
                        }),
                      ],
                    }),
                ],
              })
            : Object(J.jsx)("h3", {
                children: "Select a feature to view and edit",
              });
        },
        st = n(298),
        lt = n.n(st),
        dt = l.d.div.withConfig({
          displayName: "Pagination__Wrapper",
          componentId: "sc-2n2y1y-0",
        })([
          "ul{display:flex;justify-content:center;li{color:black;margin:0px 5px;cursor:pointer;}.active-page{font-weight:700}}",
        ]),
        ut = function (e) {
          var t = e.page,
            n = e.pages,
            a = e.onPageChange;
          return Object(J.jsx)(dt, {
            children: Object(J.jsx)(lt.a, {
              pageCount: n,
              pageRangeDisplayed: 5,
              marginPagesDisplayed: 3,
              forcePage: t,
              onPageChange: function (e) {
                return a(e.selected);
              },
              activeClassName: "active-page",
            }),
          });
        },
        bt = {
          HoverToolTip: l.d.div.withConfig({
            displayName: "HoverToolTipStyles__HoverToolTip",
            componentId: "so9b5o-0",
          })(
            [
              "position:absolute;top:",
              "px;left:",
              "px;background-color:",
              ";padding:20px;color:white;z-index:10;transform:translate(-50%,0 );",
            ],
            function (e) {
              return e.y;
            },
            function (e) {
              return e.x;
            },
            function (e) {
              return e.theme.colors.secondary;
            }
          ),
          PropertiesTable: l.d.table.withConfig({
            displayName: "HoverToolTipStyles__PropertiesTable",
            componentId: "so9b5o-1",
          })(["width:100%;"]),
          PropertyName: l.d.td.withConfig({
            displayName: "HoverToolTipStyles__PropertyName",
            componentId: "so9b5o-2",
          })(["text-align:left;font-weight:700;"]),
          PropertyVal: l.d.td.withConfig({
            displayName: "HoverToolTipStyles__PropertyVal",
            componentId: "so9b5o-3",
          })(["text-align:right;"]),
          Property: l.d.tr.withConfig({
            displayName: "HoverToolTipStyles__Property",
            componentId: "so9b5o-4",
          })([""]),
        },
        jt = function (e) {
          var t = e.x,
            n = e.y,
            a = e.info;
          return (
            console.log("tool tip ", t, n, a),
            Object(J.jsx)(bt.HoverToolTip, {
              x: t,
              y: n,
              children: Object(J.jsx)(bt.PropertiesTable, {
                children: Object(J.jsx)("tbody", {
                  children: Object.entries(a).map(function (e) {
                    return Object(J.jsxs)(bt.Property, {
                      children: [
                        Object(J.jsx)(bt.PropertyName, { children: e[0] }),
                        Object(J.jsx)(bt.PropertyVal, { children: e[1] }),
                      ],
                    });
                  }),
                }),
              }),
            })
          );
        },
        pt = {
          longitude: -74.006,
          latitude: 40.7128,
          zoom: 10,
          pitch: 0,
          bearing: 0,
        },
        ht = function () {
          var e = Object(ne.m)().id,
            t = Object(o.useState)(null),
            n = Object(O.a)(t, 2),
            a = n[0],
            r = n[1],
            c = Object(o.useState)(null),
            i = Object(O.a)(c, 2),
            s = i[0],
            l = i[1],
            d = Object(o.useState)("Query"),
            b = Object(O.a)(d, 2),
            f = b[0],
            x = b[1],
            m = Object(o.useState)(null),
            y = Object(O.a)(m, 2),
            v = y[0],
            S = y[1];
          console.log("Hover info ", v);
          var w = Me(e),
            _ = w.dataset,
            C = w.loading,
            N =
              (w.error,
              Ge(a ? { sql: a } : { datasetId: e }, { perPage: 100 })),
            k = N.data,
            D = N.loading,
            P = N.error,
            I = N.pages,
            E = N.page,
            L = N.setPage;
          if (C) return Object(J.jsx)("div", { children: "LOADING..." });
          var T = (function (e) {
              var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
              return e
                ? new Ye.a(
                    Object(g.a)(
                      {
                        data: e,
                        getLineColor: [255, 0, 0, 255],
                        getLineWidth: 1,
                        lineWidthUnits: "pixels",
                        getFillColor: [226, 125, 96, 200],
                        getBorderColor: [200, 200, 200],
                        getRadius: 40,
                        stroked: !0,
                        pickable: !0,
                        autoHighlight: !0,
                        highlightColor: [200, 100, 200, 200],
                        radiusUnits: "pixels",
                      },
                      t
                    )
                  )
                : null;
            })(
              a
                ? ""
                    .concat(window.origin, "/api/tiler/{z}/{x}/{y}?q=")
                    .concat(a)
                : ""
                    .concat(window.origin, "/api/tiler/dataset/")
                    .concat(e, "/{z}/{x}/{y}")
            ),
            A = function (e) {
              l(e), x("Feature");
            };
          return Object(J.jsxs)(j, {
            children: [
              Object(J.jsxs)(h, {
                children: [
                  Object(J.jsx)("h2", {
                    children: C
                      ? e
                      : null === _ || void 0 === _
                      ? void 0
                      : _.name,
                  }),
                  Object(J.jsx)("p", {
                    children:
                      null === _ || void 0 === _ ? void 0 : _.description,
                  }),
                  Object(J.jsxs)("p", {
                    children: [
                      "Id column :",
                      null === _ || void 0 === _ ? void 0 : _.id_col,
                      " ",
                    ],
                  }),
                  Object(J.jsxs)("p", {
                    children: [
                      "Geom column : ",
                      null === _ || void 0 === _ ? void 0 : _.geom_col,
                    ],
                  }),
                  Object(J.jsx)(u, {}),
                  Object(J.jsxs)("p", {
                    children: [
                      "Created at: ",
                      null === _ || void 0 === _ ? void 0 : _.created_at,
                    ],
                  }),
                  Object(J.jsxs)("p", {
                    children: [
                      "Updated at: ",
                      null === _ || void 0 === _ ? void 0 : _.updated_at,
                    ],
                  }),
                ],
              }),
              Object(J.jsx)(p, {
                children:
                  _ &&
                  Object(J.jsxs)(qe.Content, {
                    children: [
                      Object(J.jsxs)(qe.Table, {
                        children: [
                          D
                            ? Object(J.jsx)("h3", { children: "Loading" })
                            : Object(J.jsx)($e, {
                                data: k,
                                selectedID: s ? s[_.id_col] : null,
                                onSelect: A,
                                idCol: _.id_col,
                              }),
                          I &&
                            Object(J.jsx)(qe.TablePagination, {
                              children: Object(J.jsx)(ut, {
                                pages: I,
                                page: E,
                                onPageChange: function (e) {
                                  return L(e);
                                },
                              }),
                            }),
                        ],
                      }),
                      Object(J.jsx)(qe.Map, {
                        children: Object(J.jsxs)(We.a, {
                          width: "100%",
                          height: "100%",
                          initialViewState: pt,
                          layers: T ? [T] : [],
                          controller: !0,
                          onClick: function (e, t) {
                            console.log("MAP CLICK ", e, t),
                              A(e.object.properties);
                          },
                          onHover: function (e) {
                            S(e);
                          },
                          children: [
                            Object(J.jsx)(Je.a, {
                              mapboxApiAccessToken:
                                "pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw",
                              width: "100%",
                              height: "100%",
                              mapStyle: "mapbox://styles/mapbox/dark-v10",
                            }),
                            v &&
                              v.object &&
                              Object(J.jsx)(jt, {
                                x: v.x,
                                y: v.y,
                                info: v.object.properties,
                              }),
                          ],
                        }),
                      }),
                      Object(J.jsx)(qe.Details, {
                        children: Object(J.jsxs)(le, {
                          onTabSelected: x,
                          activeTab: f,
                          children: [
                            Object(J.jsx)(se, {
                              name: "Query",
                              children: Object(J.jsx)(at, {
                                table: _.name,
                                onQuery: r,
                                error: P,
                              }),
                            }),
                            Object(J.jsx)(se, {
                              name: "Feature",
                              children: Object(J.jsx)(it, {
                                feature: s,
                                onSave: function (e) {},
                                editable: !0,
                              }),
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
              }),
            ],
          });
        },
        ft = {
          DashboardBuilderPage: Object(l.d)(p).withConfig({
            displayName: "DashboardBuilderPageStyles__DashboardBuilderPage",
            componentId: "sc-1j35hle-0",
          })(["flex:1;"]),
        },
        Ot = {
          Map: l.d.div.withConfig({
            displayName: "DashboardViewerStyles__Map",
            componentId: "a6fu0d-0",
          })(["width:100%;height:100%;border-radius:10px;"]),
          Stats: l.d.div.withConfig({
            displayName: "DashboardViewerStyles__Stats",
            componentId: "a6fu0d-1",
          })([""]),
          DashboardOuter: l.d.div.withConfig({
            displayName: "DashboardViewerStyles__DashboardOuter",
            componentId: "a6fu0d-2",
          })(["width:100%;height:100%;position:relative;"]),
        },
        gt = n(42);
      !(function (e) {
        (e[(e.START_LOADING = 0)] = "START_LOADING"),
          (e[(e.LOADING_DONE = 1)] = "LOADING_DONE"),
          (e[(e.SAVING_STARTED = 2)] = "SAVING_STARTED"),
          (e[(e.SAVING_DONE = 3)] = "SAVING_DONE"),
          (e[(e.SET_DASHBOARD = 4)] = "SET_DASHBOARD"),
          (e[(e.SET_ERROR = 5)] = "SET_ERROR"),
          (e[(e.SET_BASEMAP = 6)] = "SET_BASEMAP"),
          (e[(e.ADD_LAYER = 7)] = "ADD_LAYER"),
          (e[(e.SHOW_NEW_LAYER_MODAL = 8)] = "SHOW_NEW_LAYER_MODAL"),
          (e[(e.HIDE_NEW_LAYER_MODAL = 9)] = "HIDE_NEW_LAYER_MODAL"),
          (e[(e.UPDATE_LAYER_STYLE = 10)] = "UPDATE_LAYER_STYLE");
      })(Fe || (Fe = {}));
      var xt = {
          dashboard: null,
          saving: !1,
          loading: !1,
          newLayerModalVisible: !1,
          errors: [],
        },
        mt = Object(o.createContext)({
          state: xt,
          dispatch: function () {
            return null;
          },
        }),
        yt = mt.Provider,
        vt = function (e, t) {
          if (e) {
            var n = Object(g.a)({}, e);
            return (
              (n.map_style.layers = [].concat(
                Object(gt.a)(n.map_style.layers),
                [t]
              )),
              n
            );
          }
          return null;
        },
        St = function (e, t) {
          if (e) {
            var n = Object(g.a)({}, e),
              a = n.map_style.layers;
            return (
              (n.map_style.layers = a.map(function (e) {
                return e.name == t.name
                  ? Object(g.a)(Object(g.a)({}, e), {}, { style: t.style })
                  : e;
              })),
              n
            );
          }
          return null;
        },
        wt = function (e, t) {
          if (e) {
            var n = Object(g.a)({}, e);
            return (n.map_style.base_map = t), n;
          }
          return null;
        };
      function _t(e, t) {
        switch ((console.info("Running action ", t), t.type)) {
          case Fe.ADD_LAYER:
            return Object(g.a)(
              Object(g.a)({}, e),
              {},
              { dashboard: vt(e.dashboard, t.payload) }
            );
          case Fe.START_LOADING:
            return Object(g.a)(Object(g.a)({}, e), {}, { loading: !0 });
          case Fe.LOADING_DONE:
            return Object(g.a)(Object(g.a)({}, e), {}, { loading: !1 });
          case Fe.SAVING_STARTED:
            return Object(g.a)(Object(g.a)({}, e), {}, { saving: !0 });
          case Fe.SAVING_DONE:
            return Object(g.a)(Object(g.a)({}, e), {}, { saving: !1 });
          case Fe.SET_ERROR:
            return Object(g.a)(
              Object(g.a)({}, e),
              {},
              { errors: [].concat(Object(gt.a)(e.errors), [t.payload]) }
            );
          case Fe.SET_DASHBOARD:
            return Object(g.a)(
              Object(g.a)({}, e),
              {},
              { dashboard: t.payload }
            );
          case Fe.SET_BASEMAP:
            return Object(g.a)(
              Object(g.a)({}, e),
              {},
              { dashboard: wt(e.dashboard, t.payload) }
            );
          case Fe.SHOW_NEW_LAYER_MODAL:
            return Object(g.a)(
              Object(g.a)({}, e),
              {},
              { newLayerModalVisible: !0 }
            );
          case Fe.HIDE_NEW_LAYER_MODAL:
            return Object(g.a)(
              Object(g.a)({}, e),
              {},
              { newLayerModalVisible: !1 }
            );
          case Fe.UPDATE_LAYER_STYLE:
            return Object(g.a)(
              Object(g.a)({}, e),
              {},
              { dashboard: St(e.dashboard, t.payload) }
            );
          default:
            return e;
        }
      }
      var Ct = function () {
          var e = Object(o.useContext)(mt),
            t = e.state,
            n = e.dispatch;
          return Object(g.a)(
            Object(g.a)({}, t),
            {},
            {
              dispatch: n,
              updateBaseMap: function (e) {
                n({ type: Fe.SET_BASEMAP, payload: e });
              },
              addLayer: function (e) {
                n({ type: Fe.ADD_LAYER, payload: e });
              },
              showNewLayerModal: function () {
                n({ type: Fe.SHOW_NEW_LAYER_MODAL });
              },
              hideNewLayerModal: function () {
                n({ type: Fe.HIDE_NEW_LAYER_MODAL });
              },
              updateLayerStyle: function (e, t) {
                n({
                  type: Fe.UPDATE_LAYER_STYLE,
                  payload: { name: e, style: t },
                });
              },
            }
          );
        },
        Nt = function (e) {
          var t = e.children,
            n = e.dashboard_id,
            a = Object(o.useReducer)(_t, xt),
            r = Object(O.a)(a, 2),
            c = r[0],
            i = r[1],
            s = c.dashboard;
          Object(o.useEffect)(
            function () {
              console.log("State update", c);
            },
            [c]
          );
          var l = function (e) {
            if (e) {
              i({ type: Fe.SAVING_STARTED });
              var t = {
                map_style: e.map_style,
                name: e.name,
                description: e.description,
                public: e.public,
              };
              (function (e, t) {
                return z.apply(this, arguments);
              })(e.id, t)
                .catch(function (e) {
                  i({ type: Fe.SET_ERROR, payload: e.toString() });
                })
                .finally(function () {
                  i({ type: Fe.SAVING_DONE });
                });
            }
          };
          return (
            (function (e, t, n) {
              var a = Object(o.useCallback)(e, n);
              Object(o.useEffect)(
                function () {
                  var e = setTimeout(function () {
                    a();
                  }, t);
                  return function () {
                    clearTimeout(e);
                  };
                },
                [a, t]
              );
            })(
              function () {
                return l(s);
              },
              1e3,
              [s]
            ),
            Object(o.useEffect)(
              function () {
                n &&
                  (i({ type: Fe.START_LOADING }),
                  (function (e) {
                    return F.apply(this, arguments);
                  })(n)
                    .then(function (e) {
                      i({ type: Fe.SET_DASHBOARD, payload: e.data });
                    })
                    .catch(function (e) {
                      i({ type: Fe.SET_ERROR, payload: e.toString() });
                    })
                    .finally(function () {
                      i({ type: Fe.LOADING_DONE });
                    }));
              },
              [n]
            ),
            Object(J.jsx)(yt, { value: { state: c, dispatch: i }, children: t })
          );
        };
      function kt(e) {
        if (e.single_color) return e.single_color.color;
        if (e.category_color) {
          var t = e.category_color;
          return function (e) {
            var n = "".concat(e.properties[t.column]),
              a = t.categories.findIndex(function (e) {
                return e === n;
              });
            return a >= 0 ? t.colors[a] : t.colors[t.colors.length - 1];
          };
        }
      }
      function Dt(e) {
        var t = e.source,
          n = Object.values(t)[0],
          a = {};
        switch (Object.keys(e.style)[0]) {
          case "Polygon":
            a = {
              getFillColor: kt(e.style.Polygon.fill),
              getLineColor: kt(e.style.Polygon.stroke),
              updateTriggers: {
                getFillColor: [e.style.Polygon.fill],
                getLineColor: [e.style.Polygon.stroke],
              },
              lineWidthUnits: e.style.Polygon.stroke_units,
              stroked: !0,
              getLineWidth: e.style.Polygon.stroke_width,
              pickable: !0,
            };
            break;
          case "Point":
            console.log("size units ", e.style.Point.size_units),
              (a = {
                getFillColor: kt(e.style.Point.fill),
                getLineColor: kt(e.style.Point.stroke),
                getLineWidth: e.style.Point.stroke_width,
                getRadius: e.style.Point.size,
                pickable: !0,
                radiusUnits: e.style.Point.size_units,
                lineWidthUnits: e.style.Point.stroke_units,
                updateTriggers: {
                  getFillColor: [e.style.Point.fill],
                  getBorderColor: [e.style.Point.stroke],
                },
              });
            break;
          case "Line":
            a = {
              getLineColor: kt(e.style.Line.stroke),
              getLineWidth: e.style.Line.stroke_width,
              lineWidthUnits: "pixels",
              updateTriggers: { getLineColor: [e.style.Line.stroke] },
              pickable: !0,
            };
        }
        return new Ye.a(
          Object(g.a)(
            {
              id: e.name,
              data: ""
                .concat(window.origin, "/api/tiler/dataset/")
                .concat(n, "/{z}/{x}/{y}"),
            },
            a
          )
        );
      }
      var Pt = function (e) {
          var t = e.dashboard,
            n = Ct().dashboard,
            a = t || n,
            r = null === a || void 0 === a ? void 0 : a.map_style,
            o = r ? r.layers.map(Dt) : [],
            c = (function (e) {
              switch (e) {
                case w.CartoDBPositron:
                  return "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
                case w.CartoDBVoyager:
                  return "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
                case w.CartoDBDarkMatter:
                  return "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
                case w.Light:
                  return "mapbox://styles/mapbox/light-v10";
                case w.Dark:
                  return "mapbox://styles/mapbox/dark-v10";
                case w.Satelite:
                  return "mapbox://styles/mapbox/satellite-v9";
                case w.Terrain:
                  return "mapbox://styles/mapbox/outdoors-v11";
                case w.Streets:
                  return "mapbox://styles/mapbox/streets-v11";
                default:
                  return "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
              }
            })(null === r || void 0 === r ? void 0 : r.base_map);
          return (
            console.log("Base map ", c),
            Object(J.jsx)(Ot.DashboardOuter, {
              children: Object(J.jsx)(We.a, {
                width: "100%",
                height: "100%",
                initialViewState: {
                  longitude: -74.006,
                  latitude: 40.7128,
                  zoom: 10,
                  pitch: 0,
                  bearing: 0,
                },
                layers: o,
                controller: !0,
                getTooltip: function (e) {
                  var t = e.object;
                  return console.log("tool tip ", t), t && t.message;
                },
                children: Object(J.jsx)(Je.a, {
                  mapboxApiAccessToken:
                    "pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw",
                  width: "100%",
                  height: "100%",
                  mapStyle: c,
                }),
              }),
            })
          );
        },
        It = {
          BaseMapSelector: l.d.div.withConfig({
            displayName: "BaseMapSelectorStyles__BaseMapSelector",
            componentId: "jku7w-0",
          })([
            "span{color:grey;}.react-dropdown-select-content > span{color:white;}padding:10px;",
          ]),
        },
        Et = n(111),
        Lt = n.n(Et),
        Tt = function (e) {
          var t = e.baseMap,
            n = e.onChange;
          console.log("Base map is ", w, Object.values(w));
          var a = Object.entries(w).map(function (e) {
              var t = Object(O.a)(e, 2);
              return { key: t[0], label: t[1] };
            }),
            r = [{ key: t, label: w[t] }];
          return Object(J.jsxs)(It.BaseMapSelector, {
            children: [
              Object(J.jsx)("label", { children: "Select a basemap" }),
              Object(J.jsx)(Lt.a, {
                options: a,
                values: r,
                labelField: "label",
                valueField: "key",
                onChange: function (e) {
                  var t = w[e[0].key];
                  n(t);
                },
              }),
            ],
          });
        },
        At = {
          LayerList: l.d.div.withConfig({
            displayName: "LayerListStyles__LayerList",
            componentId: "sc-136u2s1-0",
          })(["padding:10px;flex:1;overflow-y:auto;"]),
        },
        Bt = {
          LayerControls: l.d.div.withConfig({
            displayName: "LayerControlsStyles__LayerControls",
            componentId: "sc-2v9nq7-0",
          })([
            "h3{font-size:20px;font-weight:bold;margin-bottom:10px;cursor:pointer;}padding:10px 0px;section{padding:10px 0px 0px 5px;}",
          ]),
        },
        Rt = function (e) {
          var t = Object(o.useState)(void 0),
            n = Object(O.a)(t, 2),
            a = n[0],
            r = n[1];
          return (
            Object(o.useEffect)(
              function () {
                if ("Dataset" != Object.keys(e)[0])
                  throw Error(
                    "Source type is not implemented yet ".concat(
                      JSON.stringify(e),
                      " "
                    )
                  );
                (function (e) {
                  return M.apply(this, arguments);
                })(e.Dataset).then(function (e) {
                  r(e.data);
                });
              },
              [e]
            ),
            a
          );
        },
        Ut = {
          SimpleSwitch: l.d.div.withConfig({
            displayName: "SimpleSwitchStyles__SimpleSwitch",
            componentId: "sc-1cyw1hh-0",
          })([
            "display:flex;flex-direction:row;justify-content:space-between;",
          ]),
          Option: l.d.button.withConfig({
            displayName: "SimpleSwitchStyles__Option",
            componentId: "sc-1cyw1hh-1",
          })(
            [
              "background:none;border:none;padding:0px;margin:0px;font-weight:",
              ";cursor:pointer;",
            ],
            function (e) {
              return e.selected ? 700 : 200;
            }
          ),
        },
        Mt = function (e) {
          var t = e.selected,
            n = e.options,
            a = e.onChange;
          return (
            console.log("sinple switch ", n),
            Object(J.jsx)(Ut.SimpleSwitch, {
              children: n.map(function (e) {
                return Object(J.jsx)(Ut.Option, {
                  onClick: function () {
                    return a(e);
                  },
                  selected: t === e,
                  children: e,
                });
              }),
            })
          );
        },
        Ft = {
          Selector: l.d.section.withConfig({
            displayName: "DashboardBuilderSelectorStyles__Selector",
            componentId: "sc-662hjh-0",
          })(["padding-left:20px;border-left:1px solid white;"]),
          Header: l.d.div.withConfig({
            displayName: "DashboardBuilderSelectorStyles__Header",
            componentId: "sc-662hjh-1",
          })([
            "display:flex;flex-direction:row;justify-content:space-between;.icon{margin-right:10px;}",
          ]),
          Modes: l.d.p.withConfig({
            displayName: "DashboardBuilderSelectorStyles__Modes",
            componentId: "sc-662hjh-2",
          })(["display:flex;flex-direction:row;"]),
        },
        Gt = Object(g.a)({}, Ft),
        zt = n(553);
      function Vt(e, t) {
        var n = Object(o.useState)(void 0),
          a = Object(O.a)(n, 2),
          r = a[0],
          c = a[1];
        return (
          Object(o.useEffect)(
            function () {
              if (e && t) {
                if ("Dataset" != Object.keys(e)[0])
                  throw Error(
                    "Layer source does not implement this functionality yet"
                  );
                (function (e, t) {
                  return H.apply(this, arguments);
                })(e.Dataset, t)
                  .then(function (e) {
                    console.log("result from querry ", e),
                      c(e.data.ValueCounts);
                  })
                  .catch(function (e) {
                    console.log("failed to get column values", e), c(void 0);
                  });
              } else c(void 0);
            },
            [e, t]
          ),
          r
        );
      }
      var Ht,
        qt = n(317),
        Wt = {
          ColorPaletteSelector: l.d.div.withConfig({
            displayName: "ColorPaletteSelectorStyles__ColorPaletteSelector",
            componentId: "sc-1g9r163-0",
          })([
            "display:flex;flex-direction:row;align-items:center;svg{cursor:pointer;}",
          ]),
        },
        Yt = {
          ColorPalette: l.d.div.withConfig({
            displayName: "ColorPaletteStyles__ColorPalette",
            componentId: "sc-1ythj9h-0",
          })(["h3{color:grey;font-size:10px;}flex:1;"]),
          Colors: l.d.div.withConfig({
            displayName: "ColorPaletteStyles__Colors",
            componentId: "sc-1ythj9h-1",
          })(["display:flex;flex-direction:row;height:10px;padding:0px;"]),
          Color: l.d.div.withConfig({
            displayName: "ColorPaletteStyles__Color",
            componentId: "sc-1ythj9h-2",
          })(
            ["background-color:", ";height:100%;width:", "%;"],
            function (e) {
              return e.color;
            },
            function () {
              return 12.5;
            }
          ),
        },
        Jt = function (e) {
          var t = e.name,
            n = e.colors;
          return Object(J.jsxs)(Yt.ColorPalette, {
            children: [
              t && Object(J.jsx)("h3", { children: t }),
              Object(J.jsx)(Yt.Colors, {
                children: n.map(function (e) {
                  return Object(J.jsx)(Yt.Color, { color: e }, e);
                }),
              }),
            ],
          });
        },
        Qt = n(172),
        Zt = n.n(Qt),
        Xt = function (e, t) {
          var n = Zt.a[e][8];
          return t ? n.slice(0).reverse() : n;
        },
        Kt = n(176),
        $t = n(59),
        en = n(53),
        tn = function (e) {
          var t = e.selectedPalette,
            n = e.reversed,
            a = e.onOrderChange,
            r = e.onPaletteSelected,
            o = { value: t, label: t, customAbbreviation: t },
            c = Object.keys(Zt.a).map(function (e) {
              return { value: e, label: e, customAbbreviation: e };
            });
          return Object(J.jsxs)(Wt.ColorPaletteSelector, {
            children: [
              Object(J.jsx)(Kt.a, {
                options: c,
                values: o,
                onChange: function (e) {
                  return r(e.value);
                },
                formatOptionLabel: function (e) {
                  var t = e.value;
                  e.label, e.customAbbreviation;
                  return Object(J.jsx)(Jt, { name: t, colors: Xt(t, n) });
                },
                components: {
                  SingleValue: function (e) {
                    e.children;
                    var t = Object(qt.a)(e, ["children"]);
                    return Object(J.jsx)(
                      Jt,
                      Object(g.a)(
                        Object(g.a)({}, t),
                        {},
                        { colors: Xt(t.data.value, n) }
                      )
                    );
                  },
                },
                styles: {
                  container: function (e, t) {
                    return Object(g.a)(
                      Object(g.a)({}, e),
                      {},
                      { flex: 1, paddingRight: "10px" }
                    );
                  },
                  singleValue: function (e, t) {
                    return Object(g.a)(
                      Object(g.a)({}, e),
                      {},
                      { display: "flex", alignItems: "center" }
                    );
                  },
                },
              }),
              Object(J.jsx)($t.a, {
                onClick: function () {
                  a(!n);
                },
                icon: n ? en.b : en.c,
              }),
            ],
          });
        },
        nn = n(304),
        an = n.n(nn),
        rn = function (e) {
          var t = e.columns,
            n = e.source,
            a = (e.spec, e.onUpdate),
            r = Object(o.useState)("BuPu"),
            c = Object(O.a)(r, 2),
            i = c[0],
            s = c[1],
            l = Object(o.useState)(!1),
            d = Object(O.a)(l, 2),
            u = d[0],
            b = d[1],
            j = Object(o.useState)(void 0),
            p = Object(O.a)(j, 2),
            h = p[0],
            f = p[1];
          Object(o.useEffect)(
            function () {
              f(t ? t[0] : void 0);
            },
            [t]
          );
          var g = Vt(n, null === h || void 0 === h ? void 0 : h.name);
          Object(o.useEffect)(
            function () {
              g &&
                h &&
                a({
                  column: h.name,
                  categories: g.slice(0, 8).map(function (e) {
                    return e.name;
                  }),
                  colors: Xt(i, u)
                    .slice(0, 8)
                    .map(function (e) {
                      return [].concat(
                        Object(gt.a)(an()(e).rgba().slice(0, 3)),
                        [255]
                      );
                    }),
                });
            },
            [g, u, i, h]
          );
          var x = Xt(i, u);
          return Object(J.jsxs)("div", {
            children: [
              Object(J.jsx)("label", { children: "Column" }),
              t &&
                Object(J.jsx)(Lt.a, {
                  options: t,
                  valueField: "name",
                  labelField: "name",
                  values: [t[0]],
                  onChange: function (e) {
                    f(e[0]);
                  },
                }),
              Object(J.jsx)(tn, {
                selectedPalette: i,
                onPaletteSelected: function (e) {
                  return s(e);
                },
                reversed: u,
                onOrderChange: b,
              }),
              Object(J.jsx)("label", { children: "Include Nulls" }),
              Object(J.jsx)(zt.a, { checked: !1 }),
              g &&
                Object(J.jsxs)("table", {
                  style: { width: "100%" },
                  children: [
                    Object(J.jsx)("thead", {
                      children: Object(J.jsxs)("tr", {
                        children: [
                          Object(J.jsx)("th", { children: "Category" }),
                          Object(J.jsx)("th", { children: "Count" }),
                          Object(J.jsx)("th", { children: "Color" }),
                        ],
                      }),
                    }),
                    Object(J.jsxs)("tbody", {
                      children: [
                        g.slice(0, 8).map(function (e, t) {
                          return Object(J.jsxs)(
                            "tr",
                            {
                              children: [
                                Object(J.jsx)("td", { children: e.name }),
                                Object(J.jsx)("td", { children: e.count }),
                                Object(J.jsx)("td", {
                                  style: { backgroundColor: x[t] },
                                }),
                              ],
                            },
                            e.name
                          );
                        }),
                        Object(J.jsxs)("tr", {
                          children: [
                            Object(J.jsx)("td", { children: "Others" }),
                            Object(J.jsx)("td", {
                              children: g.slice(8, -1).reduce(function (e, t) {
                                return e + t.count;
                              }, 0),
                            }),
                            Object(J.jsx)("td", {
                              style: { backgroundColor: x[x.length - 1] },
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          });
        },
        on = n(313),
        cn = l.d.div.withConfig({
          displayName: "ColorBar",
          componentId: "sc-5xyhpw-0",
        })(
          [
            "border:2px solid white;background-color:",
            ";height:15px;cursor:pointer;",
          ],
          function (e) {
            var t = e.col;
            return "rgba(".concat(t.join(", "), ")");
          }
        ),
        sn = {
          SimpleColorSelector: l.d.div.withConfig({
            displayName: "SimpleColorSelectorStyles__SimpleColorSelector",
            componentId: "sc-15jhsl7-0",
          })([""]),
        },
        ln = function (e) {
          var t = e.spec,
            n = e.onUpdate,
            a = Object(o.useState)(!1),
            r = Object(O.a)(a, 2),
            c = r[0],
            i = r[1];
          if (
            (Object(o.useEffect)(
              function () {
                t || n({ color: C });
              },
              [t]
            ),
            !t)
          )
            return Object(J.jsx)("p", { children: "Loading ..." });
          var s = t.color;
          return Object(J.jsxs)(sn.SimpleColorSelector, {
            children: [
              Object(J.jsx)(cn, {
                onClick: function () {
                  return i(!c);
                },
                col: t.color,
              }),
              c &&
                Object(J.jsx)(on.a, {
                  onChange: function (e) {
                    var t = Object.values(e.rgb),
                      a = { color: [t[0], t[1], t[2], 255 * t[3]] };
                    n(a);
                  },
                  color: { r: s[0], g: s[1], b: s[2], a: s[3] },
                }),
            ],
          });
        };
      !(function (e) {
        (e.Value = "value"), (e.Category = "category"), (e.Simple = "manual");
      })(Ht || (Ht = {}));
      var dn = { value: en.d, category: en.a, manual: en.j },
        un = function (e) {
          var t = e.name,
            n = e.onUpdate,
            a = e.colorSpecification,
            r = e.availableTypes,
            c = e.columns,
            i = e.source,
            s = Object(o.useState)(Ht.Simple),
            l = Object(O.a)(s, 2),
            d = l[0],
            u = l[1];
          return Object(J.jsxs)("section", {
            children: [
              Object(J.jsxs)(Gt.Header, {
                children: [
                  Object(J.jsx)("label", { children: t }),
                  Object(J.jsx)(Gt.Modes, {
                    children: r.map(function (e) {
                      return Object(J.jsx)($t.a, {
                        className: "icon",
                        style: {
                          cursor: "pointer",
                          color: e === d ? "white" : "grey",
                        },
                        icon: dn[e],
                        onClick: function () {
                          return u(e);
                        },
                      });
                    }),
                  }),
                ],
              }),
              Object(J.jsxs)(Gt.Selector, {
                children: [
                  d === Ht.Simple &&
                    Object(J.jsx)(ln, {
                      spec: a.single_color,
                      onUpdate: function (e) {
                        return n({ single_color: e });
                      },
                    }),
                  d === Ht.Category &&
                    Object(J.jsx)(rn, {
                      spec: a.category_color,
                      onUpdate: function (e) {
                        return n({ category_color: e });
                      },
                      columns: c,
                      source: i,
                    }),
                ],
              }),
            ],
          });
        },
        bn = Object(g.a)({}, Ft),
        jn = n(146),
        pn =
          (n(515),
          function (e) {
            var t = e.data;
            return Object(J.jsxs)(jn.c, {
              height: 150,
              width: 250,
              children: [
                Object(J.jsx)(jn.a, { barWidth: 2, data: t }),
                Object(J.jsx)(jn.b, {}),
                Object(J.jsx)(jn.d, {}),
              ],
            });
          });
      function hn(e, t) {
        var n = Object(o.useState)(void 0),
          a = Object(O.a)(n, 2),
          r = a[0],
          c = a[1];
        return (
          Object(o.useEffect)(
            function () {
              t && e
                ? (function (e, t) {
                    return V.apply(this, arguments);
                  })(t, e)
                    .then(function (e) {
                      console.log("result from querry ", e),
                        c(e.data.BasicStats);
                    })
                    .catch(function (e) {
                      console.log("failed to get basic stats", e), c(void 0);
                    })
                : c(void 0);
            },
            [t, e]
          ),
          r
        );
      }
      var fn,
        On = function (e, t, n) {
          var a = Object(o.useState)(null),
            r = Object(O.a)(a, 2),
            c = r[0],
            i = r[1];
          return (
            Object(o.useEffect)(
              function () {
                e &&
                  t &&
                  n &&
                  (function (e, t, n) {
                    return q.apply(this, arguments);
                  })(e, t, n)
                    .then(function (e) {
                      i(e.data.Histogram);
                    })
                    .catch(function (e) {
                      console.log("Something went wrong getting histogram ", e),
                        i(void 0);
                    });
              },
              [e, t, n]
            ),
            c
          );
        },
        gn = function (e) {
          var t = e.column,
            n = e.source,
            r = Object(o.useState)(a.EqualInterval),
            c = Object(O.a)(r, 2),
            i = (c[0], c[1], On(t, n, 10)),
            s = hn(t, n);
          return Object(J.jsxs)("div", {
            children: [
              Object(J.jsx)("ul", {
                children: Object.values(a).map(function (e) {
                  return Object(J.jsx)("button", { children: e });
                }),
              }),
              i &&
                Object(J.jsx)(pn, {
                  data: i.map(function (e, t) {
                    return { id: t, x: e.bin_mid, y: e.freq };
                  }),
                }),
              s && Object(J.jsxs)("p", { children: [s.min, "- ", s.max] }),
            ],
          });
        };
      !(function (e) {
        (e.Value = "value"), (e.Simple = "manual");
      })(fn || (fn = {}));
      var xn = function (e) {
          var t = e.columns,
            n = e.source,
            r = e.name,
            c = e.valueSpecification,
            i = e.onUpdate,
            s = Object(o.useState)(null),
            l = Object(O.a)(s, 2),
            d = l[0],
            u = l[1],
            b = Object(o.useState)(a.EqualInterval),
            j = Object(O.a)(b, 2),
            p = j[0],
            h = j[1];
          Object(o.useEffect)(
            function () {
              u(t ? t[0] : null);
            },
            [t]
          );
          var f = Object(o.useState)(fn.Simple),
            x = Object(O.a)(f, 2),
            m = x[0],
            y = x[1];
          return Object(J.jsxs)("section", {
            children: [
              Object(J.jsxs)(bn.Header, {
                children: [
                  Object(J.jsx)("label", { children: r }),
                  Object(J.jsxs)(bn.Modes, {
                    children: [
                      Object(J.jsx)("p", {
                        className: "icon",
                        onClick: function () {
                          return y(fn.Simple);
                        },
                        style: {
                          cursor: "pointer",
                          color: m == fn.Simple ? "white" : "grey",
                        },
                        children: "3",
                      }),
                      Object(J.jsx)($t.a, {
                        className: "icon",
                        style: {
                          cursor: "pointer",
                          color: m == fn.Value ? "white" : "grey",
                        },
                        icon: en.d,
                        onClick: function () {
                          return y(fn.Value);
                        },
                      }),
                    ],
                  }),
                ],
              }),
              Object(J.jsx)("label", { children: "Column" }),
              t &&
                Object(J.jsx)(Kt.a, {
                  options: t,
                  getOptionValue: function (e) {
                    return e.name;
                  },
                  getOptionLabel: function (e) {
                    return e.name;
                  },
                  values: [d],
                  onChange: function (e) {
                    u(e);
                  },
                  styles: {
                    option: function (e, t) {
                      return Object(g.a)(
                        Object(g.a)({}, e),
                        {},
                        { color: "black" }
                      );
                    },
                    control: function (e) {
                      return Object(g.a)(
                        Object(g.a)({}, e),
                        {},
                        { color: "black" }
                      );
                    },
                    singleValue: function (e) {
                      return Object(g.a)(
                        Object(g.a)({}, e),
                        {},
                        { color: "black" }
                      );
                    },
                  },
                }),
              d &&
                c &&
                Object(J.jsxs)(J.Fragment, {
                  children: [
                    fn.Simple &&
                      Object(J.jsx)("div", {
                        children: Object(J.jsx)("input", {
                          value: c.simpleValue,
                          type: "number",
                          onChange: function (e) {
                            return i({
                              simpleValue: parseFloat(e.target.value),
                            });
                          },
                        }),
                      }),
                    Object(J.jsx)(gn, {
                      column: d,
                      source: n,
                      method: p,
                      onUpdate: h,
                    }),
                  ],
                }),
            ],
          });
        },
        mn = function (e) {
          var t = e.onChange,
            n = e.style,
            a = e.columns,
            r = e.source,
            o = function (e) {
              t(Object(g.a)(Object(g.a)({}, n), {}, { stroke_width: e }));
            },
            c = function (e) {
              t(Object(g.a)(Object(g.a)({}, n), {}, { stroke_units: e }));
            };
          return Object(J.jsxs)(J.Fragment, {
            children: [
              Object(J.jsx)(un, {
                name: "Fill Color",
                colorSpecification: n.fill,
                onUpdate: function (e) {
                  t(Object(g.a)(Object(g.a)({}, n), {}, { fill: e }));
                },
                columns: a,
                source: r,
                availableTypes: [Ht.Simple, Ht.Category, Ht.Value],
              }),
              Object(J.jsx)(un, {
                columns: a,
                source: r,
                name: "Stroke Color",
                colorSpecification: n.stroke,
                onUpdate: function (e) {
                  t(Object(g.a)(Object(g.a)({}, n), {}, { stroke: e }));
                },
                availableTypes: [Ht.Simple, Ht.Category, Ht.Value],
              }),
              Object(J.jsxs)("section", {
                children: [
                  Object(J.jsx)("label", { children: "Stroke Width" }),
                  Object(J.jsx)("input", {
                    value: n.stroke_width,
                    type: "number",
                    onChange: function (e) {
                      return o(parseFloat(e.target.value));
                    },
                  }),
                  Object(J.jsx)(Mt, {
                    options: Object.keys(_),
                    selected: n.stroke_units,
                    onChange: function (e) {
                      return c(e);
                    },
                  }),
                ],
              }),
              Object(J.jsx)(xn, {
                name: "Elevation",
                columns: a,
                source: r,
                valueSpecification: n.elevation,
                onUpdate: function (e) {
                  return (function (e) {
                    t(Object(g.a)(Object(g.a)({}, n), {}, { elevation: e }));
                  })(e);
                },
              }),
            ],
          });
        },
        yn = function (e) {
          var t = e.onChange,
            n = e.style,
            a = e.columns,
            r = e.source,
            o = function (e) {
              t(Object(g.a)(Object(g.a)({}, n), {}, { stroke_width: e }));
            };
          return Object(J.jsxs)(J.Fragment, {
            children: [
              Object(J.jsx)(un, {
                name: "Stroke Color",
                colorSpecification: n.stroke,
                onUpdate: function (e) {
                  t(Object(g.a)(Object(g.a)({}, n), {}, { stroke: e }));
                },
                columns: a,
                source: r,
                availableTypes: [Ht.Simple, Ht.Category],
              }),
              Object(J.jsxs)("section", {
                children: [
                  Object(J.jsxs)("label", {
                    children: [
                      "Width by ",
                      Object(J.jsx)("a", { children: "Number" }),
                      " ",
                      Object(J.jsx)("a", { children: "Value" }),
                    ],
                  }),
                  Object(J.jsx)("input", {
                    value: n.stroke_width,
                    type: "number",
                    onChange: function (e) {
                      return o(parseFloat(e.target.value));
                    },
                  }),
                ],
              }),
            ],
          });
        },
        vn = function (e) {
          var t = e.onChange,
            n = e.style,
            a = e.columns,
            r = e.source,
            o = function (e) {
              t(Object(g.a)(Object(g.a)({}, n), {}, { size: e }));
            },
            c = function (e) {
              t(Object(g.a)(Object(g.a)({}, n), {}, { size_units: e }));
            },
            i = function (e) {
              t(Object(g.a)(Object(g.a)({}, n), {}, { stroke_units: e }));
            },
            s = function (e) {
              t(Object(g.a)(Object(g.a)({}, n), {}, { stroke_width: e }));
            };
          return Object(J.jsxs)(J.Fragment, {
            children: [
              Object(J.jsx)(un, {
                name: "Fill Color",
                colorSpecification: n.fill,
                onUpdate: function (e) {
                  t(Object(g.a)(Object(g.a)({}, n), {}, { fill: e }));
                },
                columns: a,
                source: r,
                availableTypes: [Ht.Simple, Ht.Category],
              }),
              Object(J.jsx)(un, {
                name: "Stroke Color",
                colorSpecification: n.stroke,
                onUpdate: function (e) {
                  t(Object(g.a)(Object(g.a)({}, n), {}, { stroke: e }));
                },
                columns: a,
                source: r,
                availableTypes: [Ht.Simple, Ht.Category],
              }),
              Object(J.jsxs)("section", {
                children: [
                  Object(J.jsx)("label", { children: "Stroke Width" }),
                  Object(J.jsx)("input", {
                    value: n.stroke_width,
                    type: "number",
                    onChange: function (e) {
                      return s(parseFloat(e.target.value));
                    },
                  }),
                  Object(J.jsx)(Mt, {
                    options: Object.keys(_),
                    selected: n.stroke_units,
                    onChange: function (e) {
                      return i(e);
                    },
                  }),
                ],
              }),
              Object(J.jsxs)("section", {
                children: [
                  Object(J.jsx)("label", { children: "Size" }),
                  Object(J.jsx)("input", {
                    value: n.size,
                    type: "number",
                    onChange: function (e) {
                      return o(parseFloat(e.target.value));
                    },
                  }),
                  Object(J.jsx)(Mt, {
                    options: Object.keys(_),
                    selected: n.size_units,
                    onChange: function (e) {
                      return c(e);
                    },
                  }),
                ],
              }),
            ],
          });
        },
        Sn = function (e) {
          var t = e.layer,
            n = Object(o.useState)(!0),
            a = Object(O.a)(n, 2),
            r = a[0],
            c = a[1],
            i = (Object.keys(t.source)[0], Object.keys(t.style)[0]),
            s = Rt(t.source),
            l = Ct().updateLayerStyle,
            d = function (e) {
              console.log("Update style is ", e), l(t.name, e);
            };
          return Object(J.jsxs)(Bt.LayerControls, {
            children: [
              Object(J.jsxs)("h3", {
                onClick: function () {
                  return c(!r);
                },
                children: [
                  Object(J.jsx)($t.a, { icon: r ? en.e : en.f }),
                  " ",
                  t.name,
                ],
              }),
              Object(J.jsxs)("div", {
                style: { display: r ? "block" : "none" },
                children: [
                  "Polygon" == i &&
                    Object(J.jsx)(mn, {
                      onChange: function (e) {
                        return d({ Polygon: e });
                      },
                      columns: s || [],
                      source: t.source,
                      style: t.style.Polygon,
                    }),
                  "Line" == i &&
                    Object(J.jsx)(yn, {
                      onChange: function (e) {
                        return d({ Line: e });
                      },
                      columns: s || [],
                      source: t.source,
                      style: t.style.Line,
                    }),
                  "Point" == i &&
                    Object(J.jsx)(vn, {
                      onChange: function (e) {
                        return d({ Point: e });
                      },
                      columns: s || [],
                      source: t.source,
                      style: t.style.Point,
                    }),
                ],
              }),
            ],
          });
        },
        wn = function () {
          var e = Ct().dashboard,
            t = e ? e.map_style.layers : [];
          return Object(J.jsx)(At.LayerList, {
            children: t.map(function (e) {
              return Object(J.jsx)(Sn, { layer: e }, e.name);
            }),
          });
        },
        _n = {
          Section: l.d.section.withConfig({
            displayName: "DashboardBuilderControllsStyles__Section",
            componentId: "sc-1b5ow75-0",
          })(["margin:20px 0px;"]),
          Sections: l.d.div.withConfig({
            displayName: "DashboardBuilderControllsStyles__Sections",
            componentId: "sc-1b5ow75-1",
          })(["display:flex;flex-direction:column;"]),
        },
        Cn = {
          AddLayerModal: l.d.div.withConfig({
            displayName: "AddLayerModalStyles__AddLayerModal",
            componentId: "sc-14gwj2y-0",
          })([
            "padding:20px;position:fixed;top:50vh;left:50vw;transform:translate3d(-50%,-50%,0);background-color:white;z-index:10;border:1px solid black;label{color:grey;}span{color:grey;}button{margin-top:5px}",
          ]),
        },
        Nn = function (e) {
          var t = e.onDismiss,
            n = e.onDone,
            a = Pe().datasets,
            r = Object(Te.a)(),
            c = r.register,
            i = r.handleSubmit,
            s = r.errors,
            l = Object(o.useState)(null),
            d = Object(O.a)(l, 2),
            u = d[0],
            b = d[1],
            j = Object(o.useState)(null),
            p = Object(O.a)(j, 2),
            h = p[0],
            f = p[1],
            g = [
              { label: "Polygon", default: { Polygon: k } },
              { label: "Point", default: { Point: D } },
              { label: "Line", default: { Line: P } },
            ],
            x = function () {
              t();
            },
            m = u ? [u] : [],
            y = h ? [h] : [];
          return Object(J.jsx)(Cn.AddLayerModal, {
            children: Object(J.jsxs)(be, {
              onSubmit: i(function (e) {
                if (u && h) {
                  var t = {
                    source: { Dataset: u.id },
                    style: h.default,
                    name: e.name,
                    description: e.description,
                  };
                  n(t), x();
                }
              }),
              children: [
                Object(J.jsx)("label", { children: "Name" }),
                Object(J.jsx)("input", {
                  type: "text",
                  ref: c({ required: !0 }),
                  name: "name",
                }),
                s.name &&
                  "required" === s.name.type &&
                  Object(J.jsx)("p", {
                    className: "errorMsg",
                    children: "Name is required.",
                  }),
                Object(J.jsx)("label", { children: "Description" }),
                Object(J.jsx)("textarea", {
                  name: "description",
                  ref: c({ required: !0 }),
                }),
                s.description &&
                  "required" === s.description.type &&
                  Object(J.jsx)("p", {
                    className: "errorMsg",
                    children: "Description is required.",
                  }),
                Object(J.jsx)("label", { children: "Source" }),
                Object(J.jsx)(Lt.a, {
                  onChange: function (e) {
                    e.length > 0 && b(e[0]);
                  },
                  values: m,
                  options: a,
                  valueField: "id",
                  labelField: "name",
                }),
                Object(J.jsx)("label", { children: "Type" }),
                Object(J.jsx)(Lt.a, {
                  onChange: function (e) {
                    e.length > 0 && f(e[0]);
                  },
                  values: y,
                  options: g,
                  valueField: "label",
                  labelField: "label",
                }),
                Object(J.jsx)(ue, {
                  type: "submit",
                  kind: K.Primary,
                  children: "Create",
                }),
                Object(J.jsx)(ue, {
                  onClick: x,
                  kind: K.Secondary,
                  children: "Cancel",
                }),
              ],
            }),
          });
        },
        kn = function () {
          var e = Ct(),
            t = e.loading,
            n = e.dashboard,
            a = e.saving,
            r = e.errors,
            o = e.showNewLayerModal,
            c = e.hideNewLayerModal,
            i = e.newLayerModalVisible,
            s = e.updateBaseMap,
            l = e.addLayer,
            d = null === n || void 0 === n ? void 0 : n.map_style;
          return (
            console.log("SAVING IS ", a),
            Object(J.jsxs)(J.Fragment, {
              children: [
                t
                  ? Object(J.jsx)("h1", { children: "Loading..." })
                  : Object(J.jsxs)(J.Fragment, {
                      children: [
                        Object(J.jsx)("h1", {
                          children:
                            null === n || void 0 === n ? void 0 : n.name,
                        }),
                        Object(J.jsx)("p", {
                          children:
                            null === n || void 0 === n ? void 0 : n.description,
                        }),
                        d &&
                          Object(J.jsxs)(_n.Sections, {
                            children: [
                              Object(J.jsxs)(_n.Section, {
                                children: [
                                  Object(J.jsx)("h2", { children: "BaseMap" }),
                                  Object(J.jsx)(Tt, {
                                    baseMap: d.base_map,
                                    onChange: function (e) {
                                      s(e);
                                    },
                                  }),
                                ],
                              }),
                              Object(J.jsxs)(_n.Section, {
                                children: [
                                  Object(J.jsx)("h2", { children: "Layers" }),
                                  Object(J.jsx)(wn, {}),
                                  Object(J.jsx)(ue, {
                                    onClick: o,
                                    kind: K.Primary,
                                    children: "Add layer",
                                  }),
                                ],
                              }),
                            ],
                          }),
                      ],
                    }),
                Object(J.jsx)(u, {}),
                r && Object(J.jsx)("p", { children: r.slice(0, 2).join(",") }),
                a && Object(J.jsx)("p", { children: "Saving..." }),
                i && Object(J.jsx)(Nn, { onDone: l, onDismiss: c }),
              ],
            })
          );
        },
        Dn = function () {
          var e = Object(ne.m)().dashboard_id;
          return Object(J.jsx)(Nt, {
            dashboard_id: e,
            children: Object(J.jsxs)(j, {
              children: [
                Object(J.jsx)(h, {
                  size: "large",
                  children: Object(J.jsx)(kn, {}),
                }),
                Object(J.jsx)(ft.DashboardBuilderPage, {
                  children: Object(J.jsx)(Pt, {}),
                }),
              ],
            }),
          });
        },
        Pn = n(310),
        In = function () {
          var e = $(),
            t = e.user,
            n = e.attempting_signin,
            a = e.signout;
          return t || n
            ? Object(J.jsxs)("div", {
                children: [
                  Object(J.jsxs)("h1", {
                    children: [
                      "Hi ",
                      null === t || void 0 === t ? void 0 : t.username,
                    ],
                  }),
                  Object(J.jsx)(ue, { onClick: a, children: "Signout" }),
                ],
              })
            : Object(J.jsx)(ne.c, { to: "/login" });
        },
        En = {
          Playground: l.d.div.withConfig({
            displayName: "PlaygroundStyles__Playground",
            componentId: "sc-19byl7m-0",
          })(["flex:1;display:grid;grid-template-columns:25vw 1fr;"]),
          Code: l.d.div.withConfig({
            displayName: "PlaygroundStyles__Code",
            componentId: "sc-19byl7m-1",
          })(["display:flex;flex-direction:column;"]),
          Map: l.d.div.withConfig({
            displayName: "PlaygroundStyles__Map",
            componentId: "sc-19byl7m-2",
          })([""]),
          Buttons: l.d.div.withConfig({
            displayName: "PlaygroundStyles__Buttons",
            componentId: "sc-19byl7m-3",
          })([
            "color:black;text-align:right;display:flex;flex-direction:column;justify-content:center;",
          ]),
        },
        Ln =
          (n(521),
          {
            name: "Tmp",
            description: "A teomporarry dashbaord",
            id: "2435242342342",
            owner_id: "annon",
            public: !0,
            map_style: {
              layers: [],
              center: [0, 0],
              zoom: 1,
              base_map: w.Dark,
            },
            created_at: new Date(),
            updated_at: new Date(),
          }),
        Tn = function () {
          var e = Object(o.useState)(JSON.stringify(Ln, null, 2)),
            t = Object(O.a)(e, 2),
            n = t[0],
            a = t[1],
            r = Object(o.useState)(null),
            c = Object(O.a)(r, 2),
            i = (c[0], c[1]),
            s = Object(o.useState)(Ln),
            l = Object(O.a)(s, 2),
            d = l[0],
            u = l[1];
          Object(o.useEffect)(function () {
            var e = localStorage.getItem("playground");
            if (e)
              try {
                u(JSON.parse(e)), a(e);
              } catch (t) {
                console.log("bad saved state");
              } finally {
                console.log("loaded state");
              }
          }, []);
          return Object(J.jsxs)(En.Playground, {
            children: [
              Object(J.jsxs)(En.Code, {
                children: [
                  Object(J.jsx)(tt.a, {
                    value: n,
                    theme: "dracula",
                    name: "json",
                    fontSize: "25px",
                    style: { width: "100%", flex: 1, maxHeight: "95vh" },
                    onChange: a,
                    keyboardHandler: "ace/keyboard/vim",
                  }),
                  Object(J.jsx)(En.Buttons, {
                    children: Object(J.jsx)(ue, {
                      onClick: function () {
                        try {
                          u(JSON.parse(n)),
                            localStorage.setItem("playground", n),
                            i(null);
                        } catch (e) {
                          i("Could not parse");
                        }
                      },
                      children: "Submit",
                    }),
                  }),
                ],
              }),
              Object(J.jsx)(En.Map, {
                children: Object(J.jsx)(Pt, { dashboard: d }),
              }),
            ],
          });
        },
        An = {
          NavBarOuter: l.d.div.withConfig({
            displayName: "NavBarStyles__NavBarOuter",
            componentId: "hih7gi-0",
          })([
            "width:100%;height:100%;display:flex;flex-direction:column;a{color:white;}padding:30px 10px 10px 10px;",
          ]),
          NavBarButton: l.d.div.withConfig({
            displayName: "NavBarStyles__NavBarButton",
            componentId: "hih7gi-1",
          })([
            "color:white;font-size:20px;text-align:center;flex-direction:column;align-items:center;margin-bottom:20px;",
          ]),
          NavBarSpacer: l.d.div.withConfig({
            displayName: "NavBarStyles__NavBarSpacer",
            componentId: "hih7gi-2",
          })(["flex:1;"]),
        },
        Bn = function (e) {
          var t = e.children;
          return Object(J.jsx)(An.NavBarOuter, { children: t });
        },
        Rn = An.NavBarButton,
        Un = An.NavBarSpacer;
      function Mn() {
        return Object(J.jsx)("div", {
          children: Object(J.jsx)("h2", {
            children: "Welcome to Super Simple Map Maker",
          }),
        });
      }
      n(523), n(524), n(525);
      var Fn,
        Gn = function () {
          var e = $().user;
          return Object(J.jsxs)(Ne.BrowserRouter, {
            children: [
              Object(J.jsxs)(d, {
                children: [
                  Object(J.jsx)(b, {
                    children: Object(J.jsxs)(Bn, {
                      children: [
                        Object(J.jsx)(Rn, {
                          children: Object(J.jsx)(Ne.NavLink, {
                            to: "/dashboards",
                            children: Object(J.jsx)($t.a, { icon: en.i }),
                          }),
                        }),
                        Object(J.jsx)(Rn, {
                          children: Object(J.jsx)(Ne.NavLink, {
                            to: "/datasets",
                            children: Object(J.jsx)($t.a, { icon: en.g }),
                          }),
                        }),
                        Object(J.jsx)(Un, {}),
                        Object(J.jsx)(Rn, {
                          children: Object(J.jsx)(Ne.NavLink, {
                            to: "/info",
                            children: Object(J.jsx)($t.a, { icon: en.h }),
                          }),
                        }),
                        e
                          ? Object(J.jsx)(Rn, {
                              children: Object(J.jsxs)(Ne.NavLink, {
                                to: "/profile",
                                children: [
                                  Object(J.jsx)($t.a, { icon: en.k }),
                                  Object(J.jsx)("p", { children: e.username }),
                                ],
                              }),
                            })
                          : Object(J.jsx)(Rn, {
                              children: Object(J.jsx)(Ne.NavLink, {
                                to: "/login",
                                children: Object(J.jsx)($t.a, { icon: en.k }),
                              }),
                            }),
                      ],
                    }),
                  }),
                  Object(J.jsxs)(ne.g, {
                    children: [
                      Object(J.jsx)(ne.d, {
                        exact: !0,
                        path: "/",
                        children: Object(J.jsx)(Mn, {}),
                      }),
                      Object(J.jsx)(ne.d, {
                        exact: !0,
                        path: "/login",
                        children: Object(J.jsx)(he, {}),
                      }),
                      Object(J.jsx)(ne.d, {
                        exact: !0,
                        path: "/profile",
                        children: Object(J.jsx)(In, {}),
                      }),
                      Object(J.jsx)(ne.d, {
                        exact: !0,
                        path: "/datasets",
                        children: Object(J.jsx)(Ie, {}),
                      }),
                      Object(J.jsx)(ne.d, {
                        exact: !0,
                        path: "/dashboards",
                        children: Object(J.jsx)(Ue, {}),
                      }),
                      Object(J.jsx)(ne.d, {
                        exact: !0,
                        path: "/playground",
                        children: Object(J.jsx)(Tn, {}),
                      }),
                      Object(J.jsx)(ne.d, {
                        exact: !0,
                        path: "/datasets/:id",
                        component: ht,
                      }),
                      Object(J.jsx)(ne.d, {
                        exact: !1,
                        path: "/dashboard/:dashboard_id",
                        component: Dn,
                      }),
                      Object(J.jsx)(ne.d, {
                        exact: !0,
                        path: "/info",
                        children: Object(J.jsx)("h1", { children: "Info" }),
                      }),
                    ],
                  }),
                ],
              }),
              Object(J.jsx)(Pn.ModalContainer, {}),
            ],
          });
        },
        zn = function (e) {
          e &&
            e instanceof Function &&
            n
              .e(3)
              .then(n.bind(null, 559))
              .then(function (t) {
                var n = t.getCLS,
                  a = t.getFID,
                  r = t.getFCP,
                  o = t.getLCP,
                  c = t.getTTFB;
                n(e), a(e), r(e), o(e), c(e);
              });
        },
        Vn = n(311),
        Hn = n(312),
        qn = Object(l.b)(
          Fn ||
            (Fn = Object(Vn.a)([
              "\n    ",
              "\n    html {\n        box-sizing: border-box;\n        font-size: 100%;\n        width:100vw;\n        height:100vh;\n    };\n\n    h1{\n        font-size: 3rem;\n    }\n    h2{\n        font-size: 2rem;\n    }\n    #root{\n        width:100vw;\n        height:100vh;\n    }\n    body{\n        font-family: 'Nunito', sans-serif;\n        width:100vw;\n        height:100vh;\n    }\n    h1,h2,h3,h4,h5,h6{\n        font-family: 'Open Sans', sans-serif;\n    }\n    *, *:before, *:after {\n        box-sizing: inherit;\n    };\n    input{\n        padding:10px 20px;\n        box-shadow:none;\n    }\n    .react-dropdown-select-item{\n        color: black;\n    }\n",
            ])),
          Hn.a
        );
      s.a.render(
        Object(J.jsx)(c.a.StrictMode, {
          children: Object(J.jsx)(ee, {
            children: Object(J.jsxs)(l.a, {
              theme: {
                colors: {
                  background: "#eef8f7",
                  main: "#E27D60",
                  secondaryLight: "#b4e3dd",
                  secondary: "#41B3A3",
                  bold: "#E85A4F",
                  text: "#ffffff",
                },
                borderRadius: "10px",
              },
              children: [Object(J.jsx)(qn, {}), Object(J.jsx)(Gn, {})],
            }),
          }),
        }),
        document.getElementById("root")
      ),
        zn();
    },
  },
  [[526, 1, 2]],
]);
//# sourceMappingURL=main.57de02e3.chunk.js.map
