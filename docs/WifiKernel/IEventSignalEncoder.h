#pragma once
#include <string>

struct Event {
    std::string id;
    std::string type;
    std::string channel;
    std::string payload;
    uint64_t    timestamp;
};

struct EncodedSignal {
    std::string encoded;  // opaque, implementation-defined
    std::string tag;      // semantic label (optional)
};

class IEventSignalEncoder {
public:
    virtual ~IEventSignalEncoder() = default;
    virtual EncodedSignal encode(const Event& evt) = 0;
};
