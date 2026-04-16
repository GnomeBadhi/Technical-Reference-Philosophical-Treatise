#pragma once
#include <string>

struct RelayCommand {
    std::string encoded;
};

class IWifiRelay {
public:
    virtual ~IWifiRelay() = default;
    virtual void send(const RelayCommand& cmd) = 0;
};
