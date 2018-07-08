package main

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"log"
	"net/http"
	"strings"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
)

const (
	publicKeySrcURL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
)

type Resource struct {
	Message string `json:"message"`
}

type JwtHeader struct {
	Alg string `json:"alg"`
	Kid string `json:"kid"`
}

// MiddleWare
func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		next.ServeHTTP(w, r)
	})
}

func AuthHandler(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization := r.Header.Get("Authorization")
		jwtToken := strings.Replace(authorization, "Bearer ", "", 1)

		// Decode Header
		segments := strings.Split(jwtToken, ".")
		decodedHeader, _ := jwt.DecodeSegment(segments[0])
		var jwtHeader JwtHeader
		json.Unmarshal(decodedHeader, &jwtHeader)

		// Get public key
		resp, err := http.Get(publicKeySrcURL)
		if err != nil {
			next(w, r)
			return
		}
		defer resp.Body.Close()
		decoder := json.NewDecoder(resp.Body)
		publicKeys := make(map[string]string)
		decoder.Decode(&publicKeys)

		publicKey, ok := publicKeys[jwtHeader.Kid]
		if !ok {
			next(w, r)
			return
		}
		block, _ := pem.Decode([]byte(publicKey))
		cert, _ := x509.ParseCertificate(block.Bytes)
		pk := cert.PublicKey.(*rsa.PublicKey)

		token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
			return pk, nil
		})

		if !token.Valid {
			fmt.Println("token is invalid")
		} else {
			next(w, r)
		}
	})
}

func PublicResourceIndexHandler(w http.ResponseWriter, r *http.Request) {
	resource := Resource{Message: "public"}
	json.NewEncoder(w).Encode(resource)
}

func PrivateResourceIndexHandler(w http.ResponseWriter, r *http.Request) {
	resource := Resource{Message: "private"}
	json.NewEncoder(w).Encode(resource)
}

func main() {
	r := mux.NewRouter()
	r.Use(CorsMiddleware)
	r.HandleFunc("/public-resources", PublicResourceIndexHandler)
	r.HandleFunc("/private-resources", AuthHandler(PrivateResourceIndexHandler))

	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(":3001", nil))
}
