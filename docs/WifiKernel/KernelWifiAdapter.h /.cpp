#pragma once
#include "IEventSignalEncoder.h"
#include "IWifiRelay.h"

class KernelWifiAdapter {
public:
    KernelWifiAdapter(IEventSignalEncoder& encoder, IWifiRelay& relay)
        : encoder_(encoder), relay_(relay) {}

    void process(const Event& evt) {
        EncodedSignal sig = encoder_.encode(evt);
        RelayCommand cmd{ sig.encoded };
        relay_.send(cmd);
    }

private:
    IEventSignalEncoder& encoder_;
    IWifiRelay&          relay_;
};
