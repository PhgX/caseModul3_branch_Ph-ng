const fs = require("fs");
const http = require("http");
const mysql = require("mysql");
const url = require("url");
const qs = require("qs");

let configToMySQL = {
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "project3",
  charset: "utf8mb4",
};

const connection = mysql.createConnection(configToMySQL);
connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connect Sucess");
  }
});

const server = http.createServer((req, res) => {
  let urlParse = url.parse(req.url);
  let pathName = urlParse.pathname;
  switch (pathName) {
    case "/": {
      fs.readFile("./views/index.html", "utf-8", (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          return res.end();
        }
      });
      break;
    }
    case "/signup": {
      if (req.method === "GET") {
        fs.readFile(
          "./views/login/SignUpAccount.html",
          "utf-8",
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              res.writeHead(200, { "Content-Type": "text/html" });
              res.write(data);
              return res.end();
            }
          }
        );
      } else {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => {
          let accountinfo = qs.parse(data);

          // Hàm check password (ít nhất 1 ký tự thường, 1 ký tự viết hoa, 1 ký tự đặc biệt, dài từ 6 đến 8 ký tự)
          let ValidatePassword = (password, repassword) => {
            let regExPassword = new RegExp(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,8}$/
            );
            if (password.match(regExPassword) && (password === repassword)) {
              return true;
            } else {
              return false;
            }
          };          

          // Hàm check email
          const ValidateEmail = (email) => {
            let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if(String(email).toLowerCase().match(emailRegex)){
                return true;
            } else {
                return false;
            };
          };
          // Check validate toàn bộ form để push vào database
          
            if (
              ValidatePassword(accountinfo.password, accountinfo.re_password) && ValidateEmail(accountinfo.email)             
            ) {
              let insertQuery = `insert into users(username, password, email, name, phone, address) 
                values('${accountinfo.username}', '${accountinfo.password}', '${accountinfo.email}', '${accountinfo.name}', '${accountinfo.phone}', '${accountinfo.address}');`;
              connection.query(insertQuery, (err, data) => {
                if (err) {
                  let userNameQuery = `select id from users where username = '${accountinfo.username}';`;
                  let emailQuery = `select id from users where email = '${accountinfo.email}';`;
                  let phoneQuery = `select id from users where email = '${accountinfo.phone}';`;
                  connection.query(userNameQuery, (err, data) => {
                    if(err) {
                        console.log(err);
                    } else {
                       let checkresult = qs.parse(data);
                       console.log(qs.parse(data));
                       if(checkresult) {
                        fs.readFile(
                            "./views/login/SignUpAccount.html",
                            "utf-8",
                            (err, data) => {
                              if (err) {
                                console.log(err);
                              } else {
                                res.writeHead(200, { "Content-Type": "text/html" });
                                res.write(data);
                                res.write("Tài khoản đã tồn tại");
                                return res.end();
                              }
                            }
                          );
                       }
                    }
                  });
                //   connection.query(emailQuery, (err, data) => {
                //     if(err) {
                //         console.log(err);
                //     } else {
                //        let checkresult = qs.parse(data);
                //        if(checkresult) {
                //         fs.readFile(
                //             "./views/login/SignUpAccount.html",
                //             "utf-8",
                //             (err, data) => {
                //               if (err) {
                //                 console.log(err);
                //               } else {
                //                 res.writeHead(200, { "Content-Type": "text/html" });
                //                 res.write(data);
                //                 res.write("Email đã tồn tại");
                //                 return res.end();
                //               }
                //             }
                //           );
                //        }
                //     }
                //   });
                //   connection.query(phoneQuery, (err, data) => {
                //     if(err) {
                //         console.log(err);
                //     } else {
                //        let checkresult = qs.parse(data);
                //        if(checkresult) {
                //         fs.readFile(
                //             "./views/login/SignUpAccount.html",
                //             "utf-8",
                //             (err, data) => {
                //               if (err) {
                //                 console.log(err);
                //               } else {
                //                 res.writeHead(200, { "Content-Type": "text/html" });
                //                 res.write(data);
                //                 res.write("Số điện thoại đã được đăng ký!!!");
                //                 return res.end();
                //               }
                //             }
                //           );
                //        }
                //     }
                //   });          
                  
                } else {
                  console.log("Create Account success");
                }
              });
            } 
            else if (accountinfo.password != accountinfo.re_password) {
              fs.readFile(
                "./views/login/SignUpAccount.html",
                "utf-8",
                (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write(data);
                    res.write("Lỗi! Mật khẩu xác nhận không đúng");
                    return res.end();
                  }
                }
              );
            } 
            else if (
              passwordvalidate(accountinfo.password, accountinfo.re_password) ==
              false
            ) {
              fs.readFile(
                "./views/login/SignUpAccount.html",
                "utf-8",
                (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write(data);
                    res.write("Lỗi! Mật khẩu nhập không đúng yêu cầu");
                    res.write(
                      "Mật khẩu có độ dài từ 6 đến 8 ký tự, có ít nhất 1 chữ cái thường, 1 viết hoa và 1 ký tự đặc biệt"
                    );
                    return res.end();
                  }
                }
              );
            } 
            else if (emailvalidate(accountinfo.email)) {
              fs.readFile(
                "./views/login/SignUpAccount.html",
                "utf-8",
                (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write(data);
                    res.write("Lỗi!! Email điền không chính xác");
                    return res.end();
                  }
                }
              );
            }
          
        });
      }

      break;
    }
    default: {
      fs.readFile("./views/404-error.html", "utf-8", (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          return res.end();
        }
      });
    }
  }
});

server.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
