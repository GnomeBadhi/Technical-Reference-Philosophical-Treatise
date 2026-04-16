#pragma once
#include "IWifiRelay.h"
#include <iostream>

class WifiRelayStub : public IWifiRelay {
public:
    WifiRelayStub(const std::string& host, uint16_t port)
        : host_(host), port_(port) {}

    void send(const RelayCommand& cmd) override {
        std::cout << "[WiFiRelay] -> " << host_ << ":" << port_
                  << " | " << cmd.encoded << std::endl;
    }

private:
    std::string host_;
    uint16_t    port_;
};
