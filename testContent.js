export default
  {
    "type": "doc",
    "content": [
      {
        attrs: {
          name: "Bernhard Bär",
          function: "Haberkorn Experte für Warnschutzkleidung",
        },
        type: "expert"
      }, {
        attrs: {
          title: "Feinstaubmaske Aura, mit Ausatemventil",
          id: 34,
        },
        type: "product"
      },
      {
        attrs: { text: "Jetzt Online anschauen", title: "tooltip", href: "https://google.com", variant: "" },
        type: "cta"
      },
      {
        attrs: { text: "Jetzt Online anschauen", title: "tooltip", href: "https://google.com", variant: "secondary" },
        type: "cta"
      },
      {
        attrs: { text: "Jetzt Online anschauen", title: "tooltip", href: "https://google.com", variant: "link" },
        type: "cta"
      },
      {
        "type": "image",
        "attrs": {
          "title": "foo",
          "src": "https://cdn.arstechnica.net/wp-content/uploads/2016/02/5718897981_10faa45ac3_b-640x624.jpg",
          "caption": "Caption"
        },
      },
      { "type": "paragraph", "content": [{ "type": "text", "text": "test" }] },
      {
        "type": "table",
        "attrs": {
          "wide": true
        },
        "content": [
          {
            "type": "table_row",
            "content": [
              {
                "type": "table_header",
                "attrs": {
                  "colspan": 1,
                  "rowspan": 1,
                  "colwidth": null,
                  "background": null
                },
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      {
                        "type": "text",
                        "text": "1"
                      }
                    ]
                  }
                ]
              }, {
                "type": "table_header",
                "attrs": {
                  "colspan": 1,
                  "rowspan": 1,
                  "colwidth": null,
                  "background": null
                },
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      {
                        "type": "text",
                        "text": "2"
                      }
                    ]
                  }
                ]
              }
            ]
          }, {
            "type": "table_row",
            "content": [
              {
                "type": "table_cell",
                "attrs": {
                  "colspan": 1,
                  "rowspan": 1,
                  "colwidth": null,
                  "background": null
                },
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      {
                        "type": "text",
                        "text": "3"
                      }
                    ]
                  }
                ]
              }, {
                "type": "table_cell",
                "attrs": {
                  "colspan": 1,
                  "rowspan": 1,
                  "colwidth": null,
                  "background": null
                },
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      {
                        "type": "text",
                        "text": "4"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      { "type": "paragraph", "content": [] },
    ]
  }