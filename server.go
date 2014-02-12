package main

import (
	"flag"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

var (
	destUrl  = flag.String("dest", "https://www.secret.ly", "api proxy destination url")
	deviceID = flag.String("deviceid", "", "unique device identifier")
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	if *deviceID == "" {
		*deviceID = guid()
	}

	p, err := mkProxy(*destUrl)
	if err != nil {
		log.Fatalln("cannot create proxy:", err)
	}

	http.Handle("/", http.FileServer(http.Dir(".")))
	http.HandleFunc("/_/", p)
	log.Println("attempting to listen on :" + port)
	http.ListenAndServe(":"+port, nil)
}

func mkProxy(destUrl string) (http.HandlerFunc, error) {
	dest, err := url.Parse(destUrl)
	if err != nil {
		return nil, err
	}
	return func(rw http.ResponseWriter, r *http.Request) {
		r.Host = dest.Host
		r.Header.Del("Origin")
		r.Header.Del("Accept-Encoding") // to avoid gzipping
		r.Header.Del("Referer")
		r.Header.Set("X-App-Id", "ly.secret.appstore")
		r.Header.Set("X-Device-Name", "iPhone")
		r.Header.Set("X-Device-Id", *deviceID)
		r.Header.Set("X-Client", "iOS-2.5.5")
		r.Header.Set("User-Agent", "Secret/2.5.5 (iPhone; iOS 7.0.4; Scale/2.00")
		proxy := httputil.NewSingleHostReverseProxy(dest)
		proxy.Transport = &dumpingTransport{}
		proxy.ServeHTTP(rw, r)
	}, nil

}

type dumpingTransport struct {
	CapturedTransport http.RoundTripper
}

func (t *dumpingTransport) RoundTrip(request *http.Request) (*http.Response, error) {
	response, err := http.DefaultTransport.RoundTrip(request)
	body, err := httputil.DumpResponse(response, true)
	if err != nil {
		return nil, err
	}
	log.Print(string(body))
	return response, err
}
