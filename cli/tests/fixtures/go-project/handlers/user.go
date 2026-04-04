package handlers

import "net/http"

func GetUser(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
}
